import { iGenRouteInfo } from '../../../../../../image-generator/src/iGenRouteInfo'
import prisma from '../../../../../../prisma-provider/src'
import { InvalidRouteError, SubRouteNotFoundError, TypeMissmatchError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'

export const routeInfo = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , routeId] = data.routeParams

  if (!routeId) {
    const route = await prisma.gameRoom.findFirst({
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

  const route = await prisma.gameRoom.findFirst({
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
