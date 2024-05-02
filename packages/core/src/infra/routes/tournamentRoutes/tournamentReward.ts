import prisma from '../../../../../prisma-provider/src'
import { RouteNotFoundError, UnexpectedError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const tournamentReward = async (data: TRouteParams) => {
  const gameRoom = await prisma.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      tournament: {
        include: {
          activePlayers: true,
        },
      },
    },
  })

  if (!gameRoom) throw new RouteNotFoundError(data.playerName, data.groupCode)

  if (!gameRoom.tournament || !gameRoom.tournament[0]) throw new UnexpectedError('tournament not found')
  const tournament = gameRoom.tournament[0]
  const player = tournament.activePlayers[0]

  const response = {
    message: `*TORNEIO #${tournament.id}* 
    
    ${player.name} vence a disputa.`,
    status: 200,
    data: null,
  }
}
