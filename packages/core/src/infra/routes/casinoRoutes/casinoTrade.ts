import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  ItemNotEligibleForBazarError,
  MissingParameterError,
  PlayerDoesNotHaveItemError,
  PlayerNotFoundError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const cassinoTrade = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , itemNameUppercase, amountString] = data.routeParams

  if (!itemNameUppercase) throw new MissingParameterError('nome do item à ser trocado no Bazar.')
  if (!amountString) throw new MissingParameterError('quantidade do item à ser trocado no Bazar.')

  const itemName = itemNameUppercase.toLowerCase()
  const amount = Number(amountString)

  if (isNaN(amount)) throw new TypeMissmatchError(amountString, 'número')

  const player =
    data.player ??
    (await prisma.player.findFirst({
      where: {
        phone: data.playerPhone,
      },
    }))
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const item = await prisma.item.findFirst({
    where: {
      name: itemName,
      ownerId: player.id,
      amount: {
        gte: amount,
      },
    },
    include: {
      baseItem: true,
    },
  })

  if (!item) throw new PlayerDoesNotHaveItemError(player.name, itemName)
  if (item.baseItem.npcPrice <= 0) throw new ItemNotEligibleForBazarError()

  const getRewardLevel = () => {
    const random = Math.random()
    if (random > 0.9) return 3
    if (random > 0.84) return 2
    if (random > 0.73) return 1.4
    if (random > 0.63) return 1
    if (random > 0.4) return 0.5
    if (random > 0.25) return 0.25
    return 0.15
  }

  const possibleRewardItems = await prisma.baseItem.findMany({
    where: {
      npcPrice: {
        lte: Math.round(item.baseItem.npcPrice * getRewardLevel() * amount),
        gt: 0,
      },
    },
  })

  const rewardItem = possibleRewardItems[Math.floor(Math.random() * possibleRewardItems.length)]

  await prisma.item.update({
    where: {
      id: item.id,
    },
    data: {
      amount: {
        decrement: amount,
      },
      ownerId: player.id,
    },
  })

  if (!rewardItem)
    return {
      message: `*${player.name}* trocou ${amount} ${itemName} no Bazar e recebeu: nada! 🤠👌`,
      status: 200,
    }

  const rewardAmount = Math.max(
    1,
    Math.round((item.baseItem.npcPrice * getRewardLevel() * amount) / rewardItem.npcPrice)
  )

  await prisma.item.upsert({
    where: {
      ownerId_name: {
        ownerId: player.id,
        name: rewardItem.name,
      },
    },
    update: {
      amount: {
        increment: rewardAmount,
      },
    },
    create: {
      ownerId: player.id,
      name: rewardItem.name,
      amount: rewardAmount,
    },
  })

  return {
    message: `*${player.name}* trocou ${amount} ${itemName} no Cassino e recebeu: ${rewardAmount} ${rewardItem.name}! \n\n 👍 - Re-trocar`,
    status: 200,
    actions: [`pz. cassino play ${rewardItem.name} ${rewardAmount}`],
  }
}
