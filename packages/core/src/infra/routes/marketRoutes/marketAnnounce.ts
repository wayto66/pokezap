import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonMustBeShinyError,
  PokemonNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const marketAnnounce = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, cashDemandInput] = data.routeParams
  if (!pokemonIdString || !cashDemandInput) throw new MissingParametersPokemonInformationError()

  const cashDemand = Number(cashDemandInput)
  if (isNaN(cashDemand)) throw new TypeMissmatchError(cashDemandInput, 'NÚMERO')

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
  if (!pokemon.isShiny) throw new PokemonMustBeShinyError()
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)

  const announcedPokemon = await prisma.pokemon.update({
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

  // const newMarketOffer = await prisma.marketOffer.create({
  //   data: {
  //     creatorId: player.id,
  //     pokemonOffer: {
  //       connect: {
  //         id: pokemon.id,
  //       },
  //     },
  //     cashDemand
  //   },
  // })

  return {
    message: `#${announcedPokemon.id} - ${announcedPokemon.baseData.name} foi anunciado no Market por $${cashDemand}.`,
    status: 200,
    actions: [],
  }
}
