import { PrismaClient, prisma } from '@prisma/client'
import { container } from 'tsyringe'
import {
  InsufficientFundsError,
  MissingParametersBuyAmountError,
  NoItemsFoundError,
  PlayerNotFoundError,
  RequestedShopItemDoesNotExists,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'

export const shopBuy = async (data: TRouteParams): Promise<IResponse> => {
  const [, , itemIdString, itemAmountString] = data.routeParams

  if (!itemAmountString) throw new MissingParametersBuyAmountError()

  const itemId = Number(itemIdString)
  const itemAmount = Number(itemAmountString)

  if (isNaN(itemId)) throw new TypeMissmatchError('id do item', 'número')
  if (isNaN(itemAmount)) throw new TypeMissmatchError('quantidade do item', 'número')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const items = await prismaClient.baseItem.findMany({
    where: {
      OR: [{ name: 'poke-ball' }, { name: 'great-ball' }, { name: 'ultra-ball' }],
    },
  })

  if (!items) throw new NoItemsFoundError()

  const requestedItem = items[itemId - 1]

  if (!requestedItem) throw new RequestedShopItemDoesNotExists(itemId)

  if (requestedItem.npcPrice * itemAmount > player.cash)
    throw new InsufficientFundsError(player.name, player.cash, requestedItem.npcPrice * itemAmount)

  let item = await prismaClient.item.findFirst({
    where: {
      baseItem: {
        id: requestedItem.id,
      },
      ownerId: player.id,
    },
  })

  if (!item) {
    item = await prismaClient.item.create({
      data: {
        ownerId: player.id,
        amount: itemAmount,
        name: requestedItem.name,
      },
    })
  } else {
    item = await prismaClient.item.update({
      where: {
        id: item.id,
      },
      data: {
        amount: {
          increment: itemAmount,
        },
      },
    })
  }

  await prismaClient.player.update({
    where: {
      id: player.id,
    },
    data: {
      cash: {
        decrement: requestedItem.npcPrice * itemAmount,
      },
    },
  })

  return {
    message: `${data.playerName} comprou ${itemAmount} ${item.name} por ${requestedItem.npcPrice * itemAmount}.`,
    status: 200,
    data: null,
  }
}
