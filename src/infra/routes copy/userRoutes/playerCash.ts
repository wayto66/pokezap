import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError, TypeMissmatchError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'

export const playerCash = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findUnique({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerName)

  return {
    message: `*#${player.id} ${player.name}* possui $${player.cash}.  `,
    status: 200,
  }
}
