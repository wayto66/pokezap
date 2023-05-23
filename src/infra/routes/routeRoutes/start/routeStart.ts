import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError, RouteAlreadyRegisteredError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'

export const routeStart = async (data: TRouteParams): Promise<IResponse> => {
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
  if (route) throw new RouteAlreadyRegisteredError()

  const newRoute = await prismaClient.gameRoom.create({
    data: {
      level: 1,
      experience: 0,
      mode: 'route',
      phone: data.groupCode,
      players: {
        connect: {
          id: player.id,
        },
      },
    },
  })

  return {
    message: `O grupo atual foi registrado com sucesso como: ROTA ${newRoute.id}`,
    status: 200,
    data: null,
  }
}
