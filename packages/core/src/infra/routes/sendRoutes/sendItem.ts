import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  InsufficientItemAmountError,
  MissingParameterError,
  PlayerInRaidIsLockedError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const sendItem = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , itemNameUppercase, amountString, targetPlayerIdString] = data.routeParams

  if (!itemNameUppercase) throw new MissingParameterError('nome do item à ser trocado')
  if (!targetPlayerIdString) throw new MissingParameterError('id do jogador que irá receber o item')
  if (!amountString) throw new MissingParameterError('quantidade do item')

  const itemName = itemNameUppercase.toLowerCase()
  const amount = Number(amountString)
  const targetPlayerId = Number(targetPlayerIdString)

  if (isNaN(amount)) throw new TypeMissmatchError(amountString, 'número')
  if (isNaN(targetPlayerId)) throw new TypeMissmatchError(targetPlayerIdString, 'número')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  const item = await prisma.item.findFirst({
    where: {
      ownerId: player.id,
      name: itemName,
    },
  })

  if (!item) throw new PokemonNotFoundError(itemName)
  if (item.amount < amount) throw new InsufficientItemAmountError(item.name, item.amount, amount)

  const targetPlayer = await prisma.player.findFirst({
    where: {
      id: targetPlayerId,
    },
  })

  if (!targetPlayer) throw new PlayerNotFoundError(targetPlayerIdString)
  if (targetPlayer.isInRaid) throw new PlayerInRaidIsLockedError(targetPlayer.name)

  if (item.ownerId === targetPlayer.id) throw new UnexpectedError('O item já pertence à você.')

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

  let sentItem = await prisma.item.findFirst({
    where: {
      ownerId: targetPlayer.id,
      name: itemName,
    },
  })

  if (sentItem) {
    sentItem = await prisma.item.update({
      where: {
        id: sentItem.id,
      },
      data: {
        amount: {
          increment: amount,
        },
      },
    })
  } else {
    sentItem = await prisma.item.create({
      data: {
        name: itemName,
        ownerId: targetPlayer.id,
        amount: amount,
      },
    })
  }

  return {
    message: `*${player.name}* enviou ${amount} ${sentItem.name} para *${targetPlayer.name}*.`,
    status: 200,
    data: null,
  }
}
