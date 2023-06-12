import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { MessageMedia } from 'whatsapp-web.js'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenRouteInfo } from '../../../../server/modules/imageGen/iGenRouteInfo'
import {
  InsufficientFundsError,
  PlayerNotFoundError,
  RouteNotFoundError,
  UnexpectedError,
  UpgradeNotFoundError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const routeUpgrade = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const [, , , upgradeNameUppercase, confirm] = data.routeParams

  if (!upgradeNameUppercase) {
    return {
      message: `Upgrades para rota:
      - ponte-de-pesca : $5000
      - poke-ranch: $5000
      - minivan : $7000
      - daycare : $5000
      - bazar : $5000
      - lab : $10000
      - bikeshop : $5000
      - barco : $12000
      - pokemon-center: $5000
      `,
      status: 200,
      data: null,
    }
  }

  const baseUpgrade = await prismaClient.baseRoomUpgrades.findFirst({
    where: {
      name: upgradeNameUppercase.toLowerCase(),
    },
  })

  if (!baseUpgrade) throw new UpgradeNotFoundError(upgradeNameUppercase)

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (player.cash < baseUpgrade.price) throw new InsufficientFundsError(player.name, player.cash, baseUpgrade.price)

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      upgrades: {
        include: {
          base: true,
        },
      },
    },
  })

  if (!route) throw new RouteNotFoundError(data.playerName, data.groupCode)
  if (route.upgrades.map(upgrade => upgrade.base.name).includes(baseUpgrade.name)) {
    const upgrade = route.upgrades.find(upgrade => upgrade.base.name === baseUpgrade.name)
    if (!upgrade) throw new UnexpectedError('Não foi possível encontrar upgrade.base.name')
    const upgradeLevelUpPrice = baseUpgrade.price + upgrade.level ** 2

    if (confirm === 'CONFIRM') {
      if (player.cash < upgradeLevelUpPrice)
        throw new InsufficientFundsError(player.name, player.cash, upgradeLevelUpPrice)
      await prismaClient.$transaction([
        prismaClient.player.update({
          where: {
            id: player.id,
          },
          data: {
            cash: {
              decrement: Math.round(upgradeLevelUpPrice),
            },
          },
        }),
        prismaClient.roomUpgrades.update({
          where: {
            id: upgrade.id,
          },
          data: {
            level: {
              increment: 1,
            },
          },
        }),
      ])

      return {
        message: `${player.name} evoluiu ${upgrade?.base.name} para o nível ${upgrade.level + 1}.`,
        status: 200,
      }
    }

    return {
      message: `Deseja evoluir o ${upgrade?.base.name} para o nível ${
        upgrade.level + 1
      } por ${upgradeLevelUpPrice}? \n \n  No nível ${upgrade.level + 1},  👍 - Confirmar`,
      status: 200,
    }
  }

  const updateRoute = await prismaClient.gameRoom.update({
    where: {
      id: route?.id,
    },
    data: {
      upgrades: {
        create: {
          baseId: baseUpgrade.id,
        },
      },
    },
    include: {
      upgrades: {
        include: {
          base: true,
        },
      },
    },
  })

  await prismaClient.player.update({
    where: {
      id: player.id,
    },
    data: {
      cash: {
        decrement: baseUpgrade.price,
      },
    },
  })

  const imageUrl = await iGenRouteInfo({
    route: updateRoute,
  })

  MessageMedia.fromFilePath(imageUrl)

  return {
    message: `*${player.name}* comprou ${baseUpgrade.name} para rota ${route.id}!`,
    status: 200,
    data: null,
    imageUrl,
  }
}
