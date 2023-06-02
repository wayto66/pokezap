import { PrismaClient } from '@prisma/client'
import { logger } from 'infra/logger'
import cron from 'node-cron'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'
import { metaValues } from '../../constants/metaValues'
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

  cron.schedule('0 0 */12 * * *', async () => {
    logger.info('Running energy reset cron')
    const players = await prismaClient.player.findMany()
    for (const player of players) {
      await prismaClient.player.update({
        where: {
          id: player.id,
        },
        data: {
          energy: 10,
        },
      })
    }
  })

  cron.schedule('0 0 */12 * * *', async () => {
    logger.info('Running energy reset cron')
    const players = await prismaClient.player.findMany()
    for (const player of players) {
      await prismaClient.player.update({
        where: {
          id: player.id,
        },
        data: {
          energy: 10,
        },
      })
    }
  })

  cron.schedule(`0 0 */8 * * *`, async () => {
    pokeBossInvasion({
      zapClient,
    })
  })
}
