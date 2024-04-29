import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { PlayerNotFoundError, UnexpectedError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const register6 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  const wildPokemonId = Number(pokemonIdString)
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
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
    },
  })
  const wildPokemon = await prismaClient.pokemon.findUnique({
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

  await prismaClient.pokemon.update({
    where: {
      id: wildPokemon.id,
    },
    data: {
      savage: false,
      ownerId: player.id,
    },
  })

  await prismaClient.player.update({
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
