import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  InsufficientItemAmountError,
  ItemNotFoundError,
  MissingParameterError,
  PlayerNotFoundError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const sellItem = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , itemNameUppercase, amountString, confirm] = data.routeParams

  if (!itemNameUppercase) throw new MissingParameterError('Nome do item')
  const itemName = itemNameUppercase.toLowerCase()

  const amount = amountString ? Number(amountString) : 1
  if (isNaN(amount)) throw new TypeMissmatchError(amountString, 'Número')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: true,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const item = await prisma.item.findFirst({
    where: {
      name: itemName,
      ownerId: player.id,
    },
    include: {
      baseItem: true,
    },
  })
  if (!item) throw new ItemNotFoundError(itemName)
  if (item.amount < amount) throw new InsufficientItemAmountError(itemName, item.amount, amount)

  const sellPrice = item.baseItem.npcPrice * amount * 0.8

  if (data.fromReact && confirm === 'CONFIRM') {
    await prisma.item.update({
      where: {
        id: item.id,
      },
      data: {
        amount: {
          decrement: amount,
        },
      },
    })

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          increment: sellPrice,
        },
      },
    })
    return {
      message: `${data.playerName} vendeu ${amount} ${item.name} por $${sellPrice}.`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Deseja vender ${amount} ${item.name} por $${sellPrice}?
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    actions: [`pz. sell item ${item.name} ${amount} confirm`],
  }
}
