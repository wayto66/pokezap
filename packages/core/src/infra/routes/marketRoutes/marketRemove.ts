import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const marketRemove = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  let searchMode = 'string'
  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
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

  const pokemon = await prisma.pokemon.findFirst({
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
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)

  if (!pokemon?.isAnnouncedInMarket) {
    return {
      message: `#${pokemon.id} - ${pokemon.baseData.name} não está anunciado no Market.`,
      status: 200,
      actions: [],
    }
  }

  await prisma.$transaction([
    prisma.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        isAnnouncedInMarket: false,
      },
    }),

    prisma.marketOffer.updateMany({
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
    }),
  ])

  return {
    message: `#${pokemon.id} - ${pokemon.baseData.name} foi removido no Market.`,
    status: 200,
    actions: [],
  }
}
