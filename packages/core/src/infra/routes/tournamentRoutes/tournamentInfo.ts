import { IResponse } from '../../../server/models/IResponse'
import { RouteNotFoundError, UnexpectedError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const tournamentInfo = async (data: TRouteParams): Promise<IResponse> => {
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

  return {
    message: `*TORNEIO #${tournament.id}* 
    
    Jogadores na disputa: 
    ${tournament.activePlayers.map(p => `- *${p.name}*`).join('\n')}`,
    status: 200,
    data: null,
  }
}
