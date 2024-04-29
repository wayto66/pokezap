import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { PlayerNotFoundError, RouteNotFoundError, UnexpectedError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const tournamentEnter = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const gameRoom = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      tournament: true,
    },
  })

  if (!gameRoom) throw new RouteNotFoundError(data.playerName, data.groupCode)

  if (!gameRoom.tournament) throw new UnexpectedError('tournament not found')
  const tournament = gameRoom.tournament[0]
  if (tournament.active) throw new UnexpectedError('tournament already started')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  await prismaClient.tournament.update({
    where: {
      id: tournament.id,
    },
    data: {
      activePlayers: {
        connect: {
          id: player.id,
        },
      },
    },
  })

  return {
    message: `*${data.playerName}* se inscreveu no torneio.`,
    status: 200,
    data: null,
  }
}
