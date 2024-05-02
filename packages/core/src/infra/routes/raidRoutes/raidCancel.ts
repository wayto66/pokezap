import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { PlayerNotFoundError, RouteNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const raidCancel = async (data: TRouteParams): Promise<IResponse> => {
  const gameRoom = await prisma.gameRoom.findFirst({
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

  await prisma.raid.updateMany({
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

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      isInRaid: false,
    },
  })

  return {
    message: `*${player.name}* cancelou a raid atual.`,
    status: 200,
    data: null,
  }
}
