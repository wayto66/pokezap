import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenInventoryItems } from '../../../../server/modules/imageGen/iGenInventoryItems'

export const inventoryItems1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , names] = data.routeParams
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

  if (names && ['NAMES', 'NOMES'].includes(names)) {
    const validItems = player.ownedItems.filter(item => item.amount > 0)
    const itemNameArray: string[] = []
    for (const item of validItems) {
      itemNameArray.push(item.name)
    }

    return {
      message: `Inventário de *${player.name}*
      ${itemNameArray.join(', ')}`,
      status: 200,
      data: null,
      imageUrl: imageUrl,
    }
  }

  return {
    message: 'Inventário de ' + player.name,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
