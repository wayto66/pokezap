import { iGenInventoryItems } from '../../../../../../image-generator/src/iGenInventoryItems'
import prisma from '../../../../../../prisma-provider/src'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'

export const inventoryItems1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , ...options] = data.routeParams

  const lastOption = options[options.length - 1]

  const numberPage = () => {
    if (!isNaN(Number(lastOption))) return Number(lastOption)
    return 1
  }

  const typeFilters = options
    .map(value => {
      if (isNaN(Number(value))) {
        if (['BALL', 'BALLS', 'POKEBALL', 'POKEBALLS'].includes(value)) return 'standard-balls special-balls'
        if (['PLATE', 'PLATES'].includes(value)) return 'plates'
        if (['GEM', 'GEMS', 'JEWEL'].includes(value)) return 'jewels'
      }
      return undefined
    })
    .filter(value => value !== undefined)
    .join(' ')
    .split(' ')
    .filter(value => value !== '')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        where: {
          amount: {
            gt: 0,
          },
          baseItem: {
            type: {
              in: typeFilters.length > 0 ? typeFilters : undefined,
            },
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
    actions: [`pz. inventory item ${numberPage() + 1}`],
  }
}
