import cron from 'node-cron'
import prisma from '../../../../../prisma-provider/src'
import { pokeBossInvasion } from '../../../server/serverActions/cron/pokeBossInvasion'
import { wildPokeSpawn } from '../../../server/serverActions/cron/wildPokeSpawn'
import { logger } from '../../helpers/logger'
import { sendMessage } from '../../helpers/sendMessage'
import { rocketInvasion } from '../../serverActions/cron/rocketInvasion'

wildPokeSpawn()

export const initProcess = async () => {
  cron.schedule(`*/20 * * * *`, () => {
    logger.info(`Natural wild pokemon spawn`)

    wildPokeSpawn()
  })

  cron.schedule('*/4 * * * *', () => {
    logger.info('Running incense cron')
    wildPokeSpawn({
      needIncense: true,
    })
  })

  cron.schedule('0 0 */4 * * *', async () => {
    logger.info('Running cp cron')
    const gameRooms = await prisma.gameRoom.findMany({
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
      await prisma.player.updateMany({
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
        await sendMessage({
          chatId: gameRoom.phone,
          content: `🔋💞 Centro pokemon da rota *#${gameRoom.id}* acaba de fornecer 2 energia extra! 🔋💞`,
        })
      } catch (e: any) {}
    }
  })

  cron.schedule('0 0 */12 * * *', async () => {
    logger.info('Running energy reset cron')
    await prisma.player.updateMany({
      data: {
        energy: 10,
      },
    })
  })

  cron.schedule(`0 0 */5 * * *`, async () => {
    pokeBossInvasion()
  })

  cron.schedule(`0 0 */3 * * *`, async () => {
    rocketInvasion()
  })
}
