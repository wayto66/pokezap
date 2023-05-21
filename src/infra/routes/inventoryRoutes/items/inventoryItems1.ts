import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenInventoryItems } from '../../../../server/modules/imageGen/iGenInventoryItems'
import { PlayerNotFoundError } from 'infra/errors/AppErrors'

export const inventoryItems1 = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const imageUrl = await iGenInventoryItems({
    playerData: player,
  })

  return {
    message: 'Invetário de ' + player.name,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
