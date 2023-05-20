import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'

export const routeEnter = async (data: TRouteParams): Promise<IResponse> => {
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

  const updatedRoute = await prismaClient.gameRoom.update({
    where: {
      phone: data.groupCode,
    },
    data: {
      players: {
        connect: {
          id: player.id,
        },
      },
    },
  })

  return {
    message: `*${player.name}* acaba de se tornar residente da *ROTA ${updatedRoute.id}!*`,
    status: 200,
    data: null,
  }
}
