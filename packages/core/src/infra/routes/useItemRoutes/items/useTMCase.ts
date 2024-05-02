import prisma from '../../../../../../prisma-provider/src'
import { IResponse } from '../../../../server/models/IResponse'
import { ItemNotFoundError, PlayerNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const useTMCase = async (data: TRouteParams): Promise<IResponse> => {
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const item = await prisma.item.findFirst({
    where: {
      baseItem: {
        name: 'tm-case',
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError('tm-case')

  const amount = Math.ceil(Math.random() * 3)

  await prisma.$transaction([
    prisma.item.upsert({
      create: {
        name: 'tm',
        amount,
        ownerId: player.id,
      },
      update: {
        amount: {
          increment: amount,
        },
      },
      where: {
        ownerId_name: {
          ownerId: player.id,
          name: 'tm',
        },
      },
    }),
    prisma.item.update({
      data: {
        amount: {
          decrement: 1,
        },
      },
      where: {
        id: item.id,
      },
    }),
  ])
  return {
    message: `🎉 *${player.name}* abre o tm-case e recebe *${amount} TM*! 🎉`,
    status: 200,
    data: null,
  }
}
