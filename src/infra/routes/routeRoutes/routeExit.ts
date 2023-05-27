import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError, RouteNotFoundError } from '../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../infra/routes/router'
import { IResponse } from '../../../server/models/IResponse'

export const routeExit = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)

  const updatedRoute = await prismaClient.gameRoom.update({
    where: {
      id: route.id,
    },
    data: {
      players: {
        disconnect: {
          id: player.id,
        },
      },
    },
  })

  return {
    message: `*${player.name}* deixou de ser residente da *ROTA ${updatedRoute.id}*.`,
    status: 200,
    data: null,
  }
}
