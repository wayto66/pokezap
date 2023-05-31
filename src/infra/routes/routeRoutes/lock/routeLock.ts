import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  InvalidRouteError,
  MissingParameterError,
  PlayerDoesNotResideOnTheRoute,
  PlayerNotFoundError,
  RouteNotFoundError,
  SubRouteNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { IResponse } from '../../../../server/models/IResponse'

export const routeLock = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , levelLockString] = data.routeParams

  if (!levelLockString) throw new MissingParameterError('Nível de trava')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      gameRooms: true,
    },
  })

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!player.gameRooms.map(g => g.id).includes(route.id))
    throw new PlayerDoesNotResideOnTheRoute(route.id, player.name)

  if (['REMOVE', 'REMOVER'].includes(levelLockString)) {
    await prismaClient.gameRoom.update({
      where: {
        id: route.id,
      },
      data: {
        levelLock: null,
      },
    })

    return {
      message: `*${player.name}* removeu o limite de nível de aparição da rota.`,
      status: 200,
      data: null,
    }
  }

  const levelLock = Number(levelLockString)
  if (isNaN(levelLock)) throw new TypeMissmatchError(levelLockString, 'Número')

  if (levelLock > route.level) throw new UnexpectedError('Levellock maior que o nível atual da rota')

  await prismaClient.gameRoom.update({
    where: {
      id: route.id,
    },
    data: {
      levelLock: levelLock,
    },
  })

  return {
    message: `*${player.name}* limitou o nível de aparição de pokemons para: ${levelLock}.`,
    status: 200,
    data: null,
  }
}
