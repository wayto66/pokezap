import { iGenRanking } from '../../../../../image-generator/src'
import prisma from '../../../../../prisma-provider/src'
import { PlayerNotFoundError, UnexpectedError } from '../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../infra/routes/router'
import { IResponse } from '../../../server/models/IResponse'

export const eloRanking = async (data: TRouteParams): Promise<IResponse> => {
  const players = await prisma.player.findMany()
  if (!players) throw new UnexpectedError('ELO RANKING')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const sortedPlayers = players.sort((a, b) => b.elo - a.elo)

  const rankEntries: any = []

  for (const player of sortedPlayers) {
    const playerInfo = {
      id: player.id,
      name: player.name,
      value: player.elo,
    }
    rankEntries.push(playerInfo)
  }

  const imageUrl = await iGenRanking({
    rankEntries,
    rankingTitle: 'Ranking ELO',
    playerName: player.name,
    playerValue: player.elo.toString(),
  })

  return {
    message: `TOP 10 - Elo Ranking`,
    status: 200,
    data: null,
    imageUrl,
  }
}
