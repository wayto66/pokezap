import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError, UnexpectedError } from '../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../infra/routes/router'
import { IResponse } from '../../../server/models/IResponse'
import { iGenRanking } from '../../../server/modules/imageGen/iGenRanking'

export const eloRanking = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const players = await prismaClient.player.findMany()
  if (!players) throw new UnexpectedError('ELO RANKING')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const sortedPlayers = players.sort((a, b) => b.elo - a.elo)

  console.log({ sortedPlayers })

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
