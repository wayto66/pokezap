import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import {
  CantSellPokemonInTeamError,
  MissingParametersBuyAmountError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PlayerOnlyHasOnePokemonError,
  PokemonNotFoundError,
  TypeMissmatchError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonSell = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, confirm] = data.routeParams

  if (!pokemonIdString) throw new MissingParametersBuyAmountError()

  const pokemonId = Number(pokemonIdString)

  if (isNaN(pokemonId)) throw new TypeMissmatchError('id do pokemon', 'número')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: true,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (player.ownedPokemons.length <= 1) throw new PlayerOnlyHasOnePokemonError(player.name)

  const pokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: pokemonId,
    },
    include: {
      baseData: true,
      teamSlot1: true,
      teamSlot2: true,
      teamSlot3: true,
      teamSlot4: true,
      teamSlot5: true,
      teamSlot6: true,
    },
  })

  if (!pokemon) throw new PokemonNotFoundError(pokemonId)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemonId, player.name)
  if (
    pokemon.teamSlot1 ||
    pokemon.teamSlot2 ||
    pokemon.teamSlot3 ||
    pokemon.teamSlot4 ||
    pokemon.teamSlot5 ||
    pokemon.teamSlot6
  )
    throw new CantSellPokemonInTeamError(pokemon.id, player.name)

  const pokemonSellPrice = Math.floor(
    35 + (pokemon.level ** 2 / 150) * 100 + (pokemon.baseData.BaseExperience ** 2 / 1200) * 50
  )

  if (data.fromReact && confirm === 'CONFIRM') {
    await prismaClient.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        owner: {
          disconnect: true,
        },
        gameRoom: {
          disconnect: true,
        },
        statusTrashed: true,
      },
    })

    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          increment: pokemonSellPrice,
        },
      },
    })
    return {
      message: `${data.playerName} vendeu #${pokemon.id} ${pokemon.baseData.name} por $${pokemonSellPrice}.`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Deseja vender #${pokemon.id} ${pokemon.baseData.name} por $${pokemonSellPrice}?
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    actions: [`pz. poke sell ${pokemon.id} confirm`],
  }
}
