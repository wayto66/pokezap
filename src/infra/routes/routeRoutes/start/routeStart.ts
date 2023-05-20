import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'

export const routeStart = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) {
    return {
      message: `Você ainda não possui um personagem registrado.
        Utilize o comando: 
        pok***p. start`,
      status: 300,
      data: null,
    }
  }

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (route) {
    return {
      message: `O grupo atual já está registrado como uma rota no jogo.`,
      status: 300,
      data: null,
    }
  }

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
