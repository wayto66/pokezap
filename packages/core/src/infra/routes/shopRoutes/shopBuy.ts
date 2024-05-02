import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  InsufficientFundsError,
  MissingParametersBuyAmountError,
  NoItemsFoundError,
  PlayerNotFoundError,
  RequestedShopItemDoesNotExists,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const shopBuy = async (data: TRouteParams): Promise<IResponse> => {
  const [, , itemIdString, itemAmountString] = data.routeParams

  if (!itemAmountString) throw new MissingParametersBuyAmountError()

  const itemId = Number(itemIdString)
  const itemName = itemIdString.toLowerCase()
  const itemAmount = Number(itemAmountString)

  const itemIdIsNumber = !isNaN(itemId)
  if (isNaN(itemAmount)) throw new TypeMissmatchError('quantidade do item', 'número')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const items = await prisma.baseItem.findMany({
    where: {
      OR: [
        { name: 'poke-ball' },
        { name: 'great-ball' },
        { name: 'ultra-ball' },
        { name: 'full-incense' },
        { name: 'thunder-stone' },
        { name: 'water-stone' },
        { name: 'fire-stone' },
        { name: 'leaf-stone' },
        { name: 'shiny-incense' },
        { name: 'elemental-incense' },
        { name: 'revive' },
      ],
    },
  })

  if (!items) throw new NoItemsFoundError()

  const requestedItem = itemIdIsNumber ? items[itemId - 1] : items.find(item => item.name === itemName)

  if (!requestedItem) throw new RequestedShopItemDoesNotExists(itemIdIsNumber ? itemId : itemName)

  if (requestedItem.npcPrice * itemAmount > player.cash)
    throw new InsufficientFundsError(player.name, player.cash, requestedItem.npcPrice * itemAmount)

  let item = itemIdIsNumber
    ? await prisma.item.findFirst({
        where: {
          baseItem: {
            id: requestedItem.id,
          },
          ownerId: player.id,
        },
      })
    : await prisma.item.findFirst({
        where: {
          baseItem: {
            name: requestedItem.name,
          },
          ownerId: player.id,
        },
      })

  if (!item) {
    item = await prisma.item.create({
      data: {
        ownerId: player.id,
        amount: itemAmount,
        name: requestedItem.name,
      },
    })
  } else {
    item = await prisma.item.update({
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

  await prisma.player.update({
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
