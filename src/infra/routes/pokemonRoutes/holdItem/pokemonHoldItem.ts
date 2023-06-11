import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../../server/modules/imageGen/iGenPokemonAnalysis'
import {
  ItemNotFoundError,
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonHoldItem = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString, itemNameUppercase] = data.routeParams
  if (!pokemonIdString) throw new MissingParameterError('Nome/Id do Pokemon e nome do Item')
  if (!itemNameUppercase) throw new MissingParameterError('Nome/Id do Pokemon e nome do Item')

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    onlyAdult: true,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prismaClient.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
      owner: true,
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })
  if (!pokemon || !pokemon.isAdult) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)

  const item = await prismaClient.item.findFirst({
    where: {
      baseItem: {
        name: itemNameUppercase.toLowerCase(),
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError(itemNameUppercase)

  const updatePokemon = await prismaClient.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      heldItem: {
        connectOrCreate: {
          where: {
            holderId_name: {
              holderId: pokemon.id,
              name: item.name,
            },
          },
          create: {
            name: item.name,
          },
        },
      },
    },
    include: {
      baseData: true,
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  await prismaClient.item.update({
    where: {
      id: item.id,
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  })

  const imageUrl = await iGenPokemonAnalysis(updatePokemon)

  return {
    message: `#${updatePokemon.id} ${updatePokemon.baseData.name.toUpperCase()} de *${player.name}* !`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
