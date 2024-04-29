import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { ItemNotFoundError, PlayerNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const usePokeballBox = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const item = await prismaClient.item.findFirst({
    where: {
      baseItem: {
        name: 'pokeball-box',
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError('pokeball-box')

  const possibleLoots = [
    'sora-ball',
    'magu-ball',
    'tinker-ball',
    'tale-ball',
    'net-ball',
    'yume-ball',
    'moon-ball',
    'dusk-ball',
    'janguru-ball',
  ]
  const beastBallTry = Math.random()
  const beastBall = beastBallTry < 0.02
  const lootName = beastBall ? 'beast-ball' : possibleLoots[Math.floor(Math.random() * possibleLoots.length)]

  await prismaClient.$transaction([
    prismaClient.item.upsert({
      create: {
        name: lootName,
        amount: 1,
        ownerId: player.id,
      },
      update: {
        amount: {
          increment: 1,
        },
      },
      where: {
        ownerId_name: {
          ownerId: player.id,
          name: lootName,
        },
      },
    }),
    prismaClient.item.update({
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

  const message = beastBall
    ? `⭐🎉⭐ Incrível! *${player.name}* abre o poke-ball-box e recebe uma incrível *${lootName}*! ⭐🎉⭐`
    : `🎉 *${player.name}* abre o poke-ball-box e recebe uma *${lootName}*! 🎉`
  return {
    message,
    status: 200,
    data: null,
  }
}