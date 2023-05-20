import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { iGenDuelX1 } from './server/modules/imageGen/iGenDuelX1'
import { handleAllProcess } from './server/process'

process.on('uncaughtException', error => {
  console.error(error)
})

const prismaClient = new PrismaClient()
container.registerInstance<PrismaClient>('PrismaClient', prismaClient)
prismaClient.message.deleteMany()

const app = express()
app.get('/abb', async () => {
  const players = await prismaClient.player.findMany({
    include: {
      teamPoke1: {
        include: {
          baseData: true,
        },
      },
    },
  })

  await iGenDuelX1({
    player1: players[1],
    player2: players[2],
  })
})
app.listen(4000, async () => {
  console.log('pokezap is online!')
})

const enableZap = true
if (enableZap) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'ZapClientInstance1' }),
  })

  container.registerInstance<Client>('ZapClientInstance1', client)
  handleAllProcess(client, 'ZapClientInstance1')
  console.log('client1 is online!')
}
