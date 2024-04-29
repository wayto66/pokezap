import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { iGenRanking } from '../../../server/modules/imageGen/iGenRanking'
import { PlayerNotFoundError, UnexpectedError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const catchRanking = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const players = await prismaClient.player.findMany()
  if (!players) throw new UnexpectedError('ELO RANKING')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const sortedPlayers = players.sort((a, b) => {
    const catchesA = [...new Set(a.caughtDexIds)]
    const catchesB = [...new Set(b.caughtDexIds)]
    return catchesB.length - catchesA.length
  })

  const rankEntries: any = []

  for (const player of sortedPlayers) {
    const playerInfo = {
      id: player.id,
      name: player.name,
      value: [...new Set(player.caughtDexIds)].length,
    }
    rankEntries.push(playerInfo)
  }

  const imageUrl = await iGenRanking({
    rankEntries,
    rankingTitle: 'Ranking Capturas Únicas',
    playerName: player.name,
    playerValue: [...new Set(player.caughtDexIds)].length.toString(),
  })

  return {
    message: `TOP 10 - Capturas Únicas`,
    status: 200,
    data: null,
    imageUrl,
  }
}
