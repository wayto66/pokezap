import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import {
  PlayerDoesNotHaveItemError,
  PlayerNotFoundError,
  PokemonAlreadyHasOwnerError,
  PokemonNotFoundError,
  MissingParametersCatchRouteError,
} from 'infra/errors/AppErrors'
import { TRouteParams } from '../router'

export const greatballCatch = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , givenId] = data.routeParams
  const pokemonId = Number(givenId)
  if (!pokemonId || typeof pokemonId !== 'number') throw new MissingParametersCatchRouteError()

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: pokemonId,
    },
    include: {
      baseData: true,
      defeatedBy: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonId)
  if (!pokemon?.savage) throw new PokemonAlreadyHasOwnerError(pokemonId, data.playerName)

  const greatball = await prismaClient.item.findFirst({
    where: {
      ownerId: player.id,
      baseItem: {
        name: 'great-ball',
      },
    },
    include: {
      baseItem: true,
    },
  })
  if (!greatball || greatball.amount <= 0) throw new PlayerDoesNotHaveItemError(data.playerName, 'greatball')

  await prismaClient.item.updateMany({
    where: {
      id: greatball.id,
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  })

  function calculateCatchRate(baseExp: number): number {
    const x = (baseExp + 10) / 304 // scale baseExp from 36-340 to 0-1
    const catchRate = 1 - Math.exp(-3 * x)
    return Math.min(1 - catchRate)
  }
  const catchRate = calculateCatchRate(pokemon.baseData.BaseExperience)
  if (catchRate > Math.random()) {
    await prismaClient.pokemon.updateMany({
      where: {
        id: pokemon.id,
      },
      data: {
        savage: false,
        ownerId: player.id,
      },
    })

    return {
      message: `${pokemon.baseData.name.toUpperCase()} foi capturado por ${data.playerName}!`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Sinto muito ${data.playerName}, sua greatball quebrou. Restam ${greatball.amount - 1} greatballs.`,
    status: 200,
    data: null,
    react: '😢',
  }
}
