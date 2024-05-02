import { IResponse } from '../../../server/models/IResponse'
import { PlayerNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const marketOffers = async (data: TRouteParams): Promise<IResponse> => {
  /* const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  let searchMode = 'string'
  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number' */

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  /*  const pokemonRequestData = getPokemonRequestData({
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
    throw new PokemonNotFoundError(pokemonRequestData.identifier) */

  const offers = await prisma.marketOffer.findMany({
    where: {
      demandPlayerId: player.id,
      active: true,
    },
    include: {
      pokemonOffer: {
        include: {
          baseData: true,
        },
      },
      pokemonDemand: {
        include: {
          baseData: true,
        },
      },
    },
  })

  const offersDisplay = offers.map(offer => {
    return `[${offer.id}] #${offer.pokemonOffer[0].id} - ${offer.pokemonOffer[0].baseData.name} por seu #${offer.pokemonDemand[0].id} - ${offer.pokemonDemand[0].baseData.name}`
  })

  return {
    message: `Ofertas no mercado para *${player.name}*: \n\n ${offersDisplay.join(
      '\n'
    )} \n\n Para aceitar, utilize: market accept (ID-DA-OFFER)`,
    status: 200,
    actions: [],
  }
}
