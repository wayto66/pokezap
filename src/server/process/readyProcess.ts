import { PrismaClient } from '@prisma/client'
import cron from 'node-cron'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'
import { CronActions } from '../../server/serverActions/cron'

export const readyProcess = (zapIstanceName: string) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const zapClient = container.resolve<Client>(zapIstanceName)
  console.log('READY')

  cron.schedule('*/3 * * * *', () => {
    console.log('Running a task every 3 minutes')
    CronActions({
      prismaClient,
      zapClient,
    })
  })
}
