import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { PlayerDoesNotHaveItemError, PlayerNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const routeIncense = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  const incenseItem = await prismaClient.item.findFirst({
    where: {
      ownerId: player.id,
      baseItem: {
        name: 'full-incense',
      },
    },
  })

  if (!incenseItem || incenseItem.amount <= 0) throw new PlayerDoesNotHaveItemError(player.name, 'full-incense')

  const updatedRoute = await prismaClient.gameRoom.update({
    where: {
      phone: data.groupCode,
    },
    data: {
      activeIncense: 'full-incense',
      incenseCharges: {
        increment: 10,
      },
    },
  })

  await prismaClient.item.update({
    where: {
      id: incenseItem.id,
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  })

  return {
    message: `*${player.name}* ativou um incenso na *ROTA ${updatedRoute.id}!*`,
    status: 200,
    data: null,
  }
}
