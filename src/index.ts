import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { handleAllProcess } from './server/process'
import { iGenShop } from './server/modules/imageGen/iGenShop'

process.on('uncaughtException', error => {
  console.error(error)
})

const prismaClient = new PrismaClient()
container.registerInstance<PrismaClient>('PrismaClient', prismaClient)
prismaClient.message.deleteMany()

const app = express()
app.get('/', async () => {
  const items = await prismaClient.baseItem.findMany({
    where: {
      OR: [
        { name: 'poke-ball' },
        { name: 'great-ball' },
        { name: 'super-ball' },
        { name: 'ultra-ball' },
        { name: 'net-ball' },
        { name: 'dive-ball' },
        { name: 'nest-ball' },
        { name: 'timer-ball' },
        { name: 'heal-ball' },
        { name: 'dusk-ball' },
        { name: 'thunder-stone' },
        { name: 'water-stone' },
        { name: 'fire-stone' },
        { name: 'moon-stone' },
      ],
    },
  })

  await iGenShop({
    items,
  })
})
app.listen(4000, async () => {
  console.log('pokezap is online!')
})

const enableZap = false
if (enableZap) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'ZapClientInstance1' }),
  })

  container.registerInstance<Client>('ZapClientInstance1', client)
  handleAllProcess(client, 'ZapClientInstance1')
  console.log('client1 is online!')
}
