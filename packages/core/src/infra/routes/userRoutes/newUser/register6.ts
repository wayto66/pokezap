import prisma from '../../../../../../prisma-provider/src'
import { IResponse } from '../../../../server/models/IResponse'
import { PlayerDoesNotHaveItemError, PlayerNotFoundError, UnexpectedError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const register6 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  const wildPokemonId = Number(pokemonIdString)

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
    },
  })
  const wildPokemon = await prisma.pokemon.findUnique({
    where: {
      id: wildPokemonId,
    },
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  })
  if (!player || !wildPokemon) throw new PlayerNotFoundError(data.playerPhone)
  if (!player.teamPoke1) throw new UnexpectedError('Não há um pokemon em seu time')
  if (!player.ownedItems.some(item => item.baseItem.name === 'poke-ball'))
    throw new PlayerDoesNotHaveItemError(player.name, 'poke-ball')

  await prisma.pokemon.update({
    where: {
      id: wildPokemon.id,
    },
    data: {
      savage: false,
      ownerId: player.id,
    },
  })

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      caughtDbIds: {
        push: wildPokemon.baseData.id,
      },
      caughtDexIds: {
        push: wildPokemon.baseData.pokedexId,
      },
    },
  })

  return {
    message: `[d] Parabéns ${player.name}! Você capturou o *${wildPokemon.baseData.name}*!
    
    Agora, vou sugerir alguns comandos para você conhecer:
    pz. inventory poke  (Para ver todos seus pokemons)
    pz. inventory item   (Para ver todos seus itens)
    pz. team     (Para ver seu time atual)
    pz. team ${wildPokemon.baseData.name} ${player.teamPoke1.baseData.name} (para remontar seu time)
    pz. team ${wildPokemon.id} ${player.teamPoke1.id} (para remontar seu time, pelos IDs dos pokemons)
    pz. loja  (comprar itens)
    pz. help`,
    status: 200,
    data: null,
  }
}
