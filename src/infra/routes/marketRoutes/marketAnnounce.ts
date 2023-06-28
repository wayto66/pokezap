import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonMustBeShinyError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { container } from 'tsyringe'
import { PrismaClient } from '@prisma/client'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'

export const marketAnnounce = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString, remove] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

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
  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (!pokemon.isShiny) throw new PokemonMustBeShinyError()

  if (remove && ['REMOVE', 'REMOVER', 'OUT'].includes(remove)) {
    const announcedPokemon = await prismaClient.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        isAnnouncedInMarket: false,
      },
      include: {
        baseData: true,
      },
    })

    await prismaClient.marketOffer.updateMany({
      where: {
        pokemonDemand: {
          some: {
            id: pokemon.id,
          },
        },
      },
      data: {
        active: false,
      },
    })

    return {
      message: `#${announcedPokemon.id} - ${announcedPokemon.baseData.name} foi removido no Market.`,
      status: 200,
      actions: [],
    }
  }

  const announcedPokemon = await prismaClient.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      isAnnouncedInMarket: true,
    },
    include: {
      baseData: true,
    },
  })

  return {
    message: `#${announcedPokemon.id} - ${announcedPokemon.baseData.name} foi anunciado no Market.`,
    status: 200,
    actions: [],
  }
}
