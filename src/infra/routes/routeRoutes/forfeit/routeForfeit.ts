import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  InsufficientFundsError,
  InvasionNotFoundError,
  PlayerDoesNotHaveItemError,
  PlayerNotFoundError,
  RouteNotFoundError,
  SendEmptyMessageError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { IResponse } from '../../../../server/models/IResponse'
import { handleRouteExperienceGain } from 'server/modules/route/handleRouteExperienceGain'

export const routeForfeit = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , confirm] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  const gameRoom = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })
  if (!gameRoom) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!gameRoom.invasorId) throw new SendEmptyMessageError()

  const invasionSession = await prismaClient.invasionSession.findFirst({
    where: {
      id: gameRoom.invasorId,
    },
  })

  if (!invasionSession) throw new InvasionNotFoundError(gameRoom.invasorId)

  if (confirm && confirm === 'CONFIRM') {
    if (player.cash < (invasionSession.forfeitCost || 0))
      throw new InsufficientFundsError(player.name, player.cash, invasionSession.forfeitCost || 0)
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          decrement: invasionSession.forfeitCost || 0,
        },
      },
    })

    await prismaClient.gameRoom.update({
      where: {
        id: gameRoom.id,
      },
      data: {
        invasor: {
          disconnect: true,
        },
        experience: {
          decrement: gameRoom.experience * 0.05,
        },
        level: Math.floor(Math.cbrt(gameRoom.experience * 0.95)),
      },
    })

    return {
      message: `A rota foi liberada com sucesso.`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Deseja pagar $${invasionSession.forfeitCost} e perder 5% de experience da rota para pedir ajuda?`,
    status: 200,
    data: null,
    actions: ['pz. route forfeit confirm'],
  }
}
