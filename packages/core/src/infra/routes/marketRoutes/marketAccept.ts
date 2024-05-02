import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParameterError,
  OfferAlreadyFinishedError,
  OfferIsNotForPlayerError,
  OfferNotFoundError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const marketAccept = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , offerIdString] = data.routeParams
  if (!offerIdString) throw new MissingParameterError('id da offer')

  const offerId = Number(offerIdString)
  if (isNaN(offerId)) throw new TypeMissmatchError(offerIdString, 'número')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const offer = await prisma.marketOffer.findUnique({
    where: {
      id: offerId,
    },
    include: {
      pokemonDemand: {
        include: {
          baseData: true,
        },
      },
      pokemonOffer: {
        include: {
          baseData: true,
        },
      },
    },
  })

  if (!offer) throw new OfferNotFoundError(offerId.toFixed(2))
  if (!offer.active) throw new OfferAlreadyFinishedError(offer.id)
  if (offer.demandPlayerId !== player.id) throw new OfferIsNotForPlayerError(offer.id)
  if (offer.pokemonDemand[0].ownerId !== player.id)
    throw new PlayerDoestNotOwnThePokemonError(offer.pokemonDemand[0].id, player.name)

  await prisma.$transaction([
    prisma.pokemon.update({
      where: {
        id: offer.pokemonDemand[0].id,
      },
      data: {
        owner: {
          disconnect: true,
        },
        savage: true,
      },
    }),
    prisma.pokemon.update({
      where: {
        id: offer.pokemonOffer[0].id,
      },
      data: {
        ownerId: player.id,
        savage: false,
      },
    }),
    prisma.marketOffer.update({
      where: {
        id: offer.id,
      },
      data: {
        accepted: true,
        active: false,
      },
    }),
  ])

  return {
    message: `#${offer.pokemonDemand[0].id} - ${offer.pokemonDemand[0].baseData.name} trocado por #${offer.pokemonOffer[0].id} - ${offer.pokemonOffer[0].baseData.name} `,
    status: 200,
    actions: [],
  }
}
