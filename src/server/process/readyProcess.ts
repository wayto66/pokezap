import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'
import { metaValues } from '../../constants/metaValues'
import { logger } from '../../infra/logger'
import { pokeBossInvasion } from '../../server/serverActions/cron/pokeBossInvasion'
import { wildPokeSpawn } from '../../server/serverActions/cron/wildPokeSpawn'
import { deleteSentMessage } from '../helpers/deleteSentMessage'
import { generateGymPokemons } from '../modules/pokemon/generate/generateGymPokemons'
import { rocketInvasion } from '../serverActions/cron/rocketInvasion'

export const readyProcess = async (zapIstanceName: string) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const zapClient = container.resolve<Client>(zapIstanceName)

  cron.schedule(`*/${metaValues.wildPokemonFleeTimeInMinutes} * * * *`, () => {
    logger.info(`Natural wild pokemon spawn`)

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

  cron.schedule('0 0 */4 * * *', async () => {
    logger.info('Running cp cron')
    const gameRooms = await prismaClient.gameRoom.findMany({
      where: {
        mode: 'route',
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

      try {
        const result = await zapClient.sendMessage(
          gameRoom.phone,
          `🔋💞 Centro pokemon da rota *#${gameRoom.id}* acaba de fornecer 2 energia extra! 🔋💞`
        )
        deleteSentMessage(result)
      } catch (e: any) {}
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

  cron.schedule(`0 0 */5 * * *`, async () => {
    pokeBossInvasion({
      zapClient,
    })
  })

  cron.schedule(`0 0 */3 * * *`, async () => {
    rocketInvasion(zapClient)
  })

  const creategympokes = false

  if (creategympokes) {
    generateGymPokemons({
      level: 90,
      name: 'poliwrath',
      ownerId: 1,
    })
    generateGymPokemons({
      level: 90,
      name: 'ludicolo',
      ownerId: 1,
    })
    generateGymPokemons({
      level: 90,
      name: 'crawdaunt',
      ownerId: 1,
    })
    generateGymPokemons({
      level: 90,
      name: 'slowking',
      ownerId: 1,
    })
    generateGymPokemons({
      level: 90,
      name: 'omastar',
      ownerId: 1,
    })
    generateGymPokemons({
      level: 90,
      name: 'blastoise-mega',
      ownerId: 1,
    })

    /// /

    generateGymPokemons({
      level: 90,
      name: 'poliwrath',
      ownerId: 2,
    })
    generateGymPokemons({
      level: 90,
      name: 'magcargo',
      ownerId: 2,
    })
    generateGymPokemons({
      level: 90,
      name: 'rhydon',
      ownerId: 2,
    })
    generateGymPokemons({
      level: 90,
      name: 'lunatone',
      ownerId: 2,
    })
    generateGymPokemons({
      level: 90,
      name: 'aerodactyl',
      ownerId: 2,
    })
    generateGymPokemons({
      level: 90,
      name: 'tyranitar-mega',
      ownerId: 2,
    })

    ///

    generateGymPokemons({
      level: 90,
      name: 'galvantula',
      ownerId: 3,
    })
    generateGymPokemons({
      level: 90,
      name: 'rotom',
      ownerId: 3,
    })
    generateGymPokemons({
      level: 90,
      name: 'magnezone',
      ownerId: 3,
    })
    generateGymPokemons({
      level: 90,
      name: 'emolga',
      ownerId: 3,
    })
    generateGymPokemons({
      level: 90,
      name: 'lanturn',
      ownerId: 3,
    })
    generateGymPokemons({
      level: 90,
      name: 'ampharos-mega',
      ownerId: 3,
    })
  }
}
