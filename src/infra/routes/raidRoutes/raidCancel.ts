import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { NoRaidRunningError, PlayerNotFoundError, RouteNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const raidCancel = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const gameRoom = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      upgrades: {
        include: {
          base: true,
        },
      },
      raid: {
        include: {
          lobbyPokemons: true,
        },
      },
      players: true,
    },
  })

  if (!gameRoom) throw new RouteNotFoundError(data.playerName, data.groupCode)

  await prismaClient.raid.updateMany({
    where: {
      gameRoomId: gameRoom.id,
    },
    data: {
      isFinished: true,
      isInProgress: false,
      inInLobby: false,
      statusTrashed: true,
    },
  })

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  await prismaClient.player.update({
    where: {
      id: player.id,
    },
    data: {
      isInRaid: false,
    },
  })

  return {
    message: `*${data.playerName}* cancelou a raid atual.`,
    status: 200,
    data: null,
  }
}
