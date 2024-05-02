import prisma from '../../../../../../prisma-provider/src'
import { IResponse } from '../../../../server/models/IResponse'
import { ItemNotFoundError, PlayerNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const usePropCase = async (data: TRouteParams): Promise<IResponse> => {
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const item = await prisma.item.findFirst({
    where: {
      baseItem: {
        name: 'prop-case',
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError('prop-case')

  const topHelds = [
    'soft-sand',
    'mystic-water',
    'magnet',
    'miracle-seed',
    'charcoal',
    'sharp-beak',
    'black-belt',
    'silk-scarf',
    'silver-powder',
    'spell-tag',
    'hard-stone',
    'never-melt-ice',
    'heart-scale',
    'machine-part',
    'dragon-skull',
  ]

  const possibleLoots = [
    'flame-plate',
    'splash-plate',
    'zap-plate',
    'meadow-plate',
    'icicle-plate',
    'fist-plate',
    'toxic-plate',
    'earth-plate',
    'sky-plate',
    'mind-plate',
    'insect-plate',
    'stone-plate',
    'spooky-plate',
    'draco-plate',
    'dread-plate',
    'iron-plate',
    'pixie-plate',
    'normal-gem',
    'fire-gem',
    'water-gem',
    'electric-gem',
    'grass-gem',
    'ice-gem',
    'fighting-gem',
    'poison-gem',
    'ground-gem',
    'flying-gem',
    'psychic-gem',
    'bug-gem',
    'rock-gem',
    'ghost-gem',
    'dragon-gem',
    'dark-gem',
    'steel-gem',
    'fairy-gem',
  ]

  const lootName = possibleLoots[Math.floor(Math.random() * possibleLoots.length)]

  await prisma.$transaction([
    prisma.item.upsert({
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
    message: `🎉 *${player.name}* abre o prop-case e recebe uma *${lootName}*! 🎉`,
    status: 200,
    data: null,
  }
}
