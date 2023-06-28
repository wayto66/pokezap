import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenInventoryItems } from '../../../../server/modules/imageGen/iGenInventoryItems'

export const inventoryItems1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , namesOrPage] = data.routeParams

  const numberPage = () => {
    if (typeof Number(namesOrPage) === 'number' && !isNaN(Number(namesOrPage))) return Number(namesOrPage)
    return 1
  }

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        where: {
          amount: {
            gt: 0,
          },
        },
        skip: Math.max(0, (numberPage() - 1) * 19),
        take: 19,
        include: {
          baseItem: true,
        },
      },
      ownedPokemons: {
        include: {
          baseData: true,
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const imageUrl = await iGenInventoryItems({
    playerData: player,
  })

  const validItems = player.ownedItems.filter(item => item.amount > 0)
  const itemNameArray: string[] = []
  for (const item of validItems) {
    itemNameArray.push(item.name)
  }

  return {
    message: `Inventário de *${player.name} - página ${numberPage()}* \n \n ${itemNameArray.join(
      ', '
    )} \n\n👍 - Próxima página.`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: ['pz. inventory item ' + numberPage() + 1],
  }
}
