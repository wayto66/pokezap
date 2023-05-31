import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { InvalidRouteError, SubRouteNotFoundError, TypeMissmatchError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenRouteInfo } from '../../../../server/modules/imageGen/iGenRouteInfo'

export const routeInfo = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , routeId] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (!routeId) {
    const route = await prismaClient.gameRoom.findFirst({
      where: {
        phone: data.groupCode,
      },
      include: {
        upgrades: {
          include: {
            base: true,
          },
        },
        players: true,
      },
    })
    if (!route) throw new InvalidRouteError()

    const imageUrl = await iGenRouteInfo({
      route,
    })

    return {
      message: `Rota ${route.id}
Nível: ${route.level}
Residentes: ${route.players.length}
Upgrades: ${route.upgrades.length}
Visitantes: 0
Cargas de incenso: ${route.incenseCharges || 0}`,
      status: 200,
      data: null,
      imageUrl,
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
