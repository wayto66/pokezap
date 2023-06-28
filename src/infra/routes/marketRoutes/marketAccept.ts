import {
  MissingParameterError,
  MissingParametersPokemonInformationError,
  OfferAlreadyFinishedError,
  OfferIsNotForPlayerError,
  OfferNotFoundError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { container } from 'tsyringe'
import { PrismaClient } from '@prisma/client'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'

export const marketAccept = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , offerIdString] = data.routeParams
  if (!offerIdString) throw new MissingParameterError('id da offer')

  const offerId = Number(offerIdString)
  if (isNaN(offerId)) throw new TypeMissmatchError(offerIdString, 'número')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const offer = await prismaClient.marketOffer.findUnique({
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

  await prismaClient.$transaction([
    prismaClient.pokemon.update({
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
    prismaClient.pokemon.update({
      where: {
        id: offer.pokemonOffer[0].id,
      },
      data: {
        ownerId: player.id,
        savage: false,
      },
    }),
    prismaClient.marketOffer.update({
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
