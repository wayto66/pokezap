import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { InvalidRouteError, SubRouteNotFoundError, TypeMissmatchError } from 'infra/errors/AppErrors'

export const routeInfo = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , routeId] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (!routeId) {
    const route = await prismaClient.gameRoom.findFirst({
      where: {
        phone: data.groupCode,
      },
      include: {
        upgrades: true,
        players: true,
      },
    })
    if (!route) throw new InvalidRouteError()

    return {
      message: `DUMMY: route found:
      Rota ${route.id}
      level: ${route.level}
      players: ${route.players.length}
      upgrades: ${route.upgrades.length}`,
      status: 200,
      data: null,
    }
  }
  if (typeof Number(routeId) !== 'number') throw new TypeMissmatchError(routeId, 'number')

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      id: Number(routeId),
    },
    include: {
      upgrades: true,
      players: true,
    },
  })
  if (!route) throw new SubRouteNotFoundError(routeId)

  return {
    message: `DUMMY: route found:
      Rota ${route.id}
      level: ${route.level}
      players: ${route.players.length}
      upgrades: ${route.upgrades.length}`,
    status: 200,
    data: null,
  }
}
