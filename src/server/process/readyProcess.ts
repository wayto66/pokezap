import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'
import { metaValues } from '../../constants/metaValues'
import { logger } from '../../infra/logger'
import { pokeBossInvasion } from '../../server/serverActions/cron/pokeBossInvasion'
import { wildPokeSpawn } from '../../server/serverActions/cron/wildPokeSpawn'

export const readyProcess = (zapIstanceName: string) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const zapClient = container.resolve<Client>(zapIstanceName)

  cron.schedule(`*/${metaValues.wildPokemonFleeTimeInMinutes} * * * *`, () => {
    logger.info(`Running a task every ${metaValues.wildPokemonFleeTimeInMinutes} minutes`)

    wildPokeSpawn({
      prismaClient,
      zapClient,
    })
  })

  cron.schedule('*/4 * * * *', () => {
    logger.info('Running incense cron')
    wildPokeSpawn({
      prismaClient,
      zapClient,
      needIncense: true,
    })
  })

  cron.schedule('0 0 */6 * * *', async () => {
    logger.info('Running cp cron')
    const gameRooms = await prismaClient.gameRoom.findMany({
      where: {
        upgrades: {
          some: {
            base: {
              name: 'pokemon-center',
            },
          },
        },
      },
      include: {
        players: true,
      },
    })

    for (const gameRoom of gameRooms) {
      await prismaClient.player.updateMany({
        where: {
          id: {
            in: gameRoom.players.map(player => player.id),
          },
        },
        data: {
          energy: {
            increment: 2,
          },
        },
      })
    }
  })

  cron.schedule('0 0 */12 * * *', async () => {
    logger.info('Running energy reset cron')
    await prismaClient.player.updateMany({
      data: {
        energy: 10,
      },
    })
  })

  cron.schedule(`0 0 */6 * * *`, async () => {
    pokeBossInvasion({
      zapClient,
    })
  })
}
