import prisma from '../../../../../../prisma-provider/src'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'

export const routeEnter = async (data: TRouteParams): Promise<IResponse> => {
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  const updatedRoute = await prisma.gameRoom.update({
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
