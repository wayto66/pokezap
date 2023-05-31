import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { handleAllProcess } from './server/process'
import { iGenPokemonAnalysis } from './server/modules/imageGen/iGenPokemonAnalysis'
import { router } from './infra/routes/router'

process.on('uncaughtException', error => {
  console.error(error)
})

const prismaClient = new PrismaClient()
container.registerInstance<PrismaClient>('PrismaClient', prismaClient)
prismaClient.message.deleteMany()

const app = express()
app.get('/', async () => {
  const response = await router({
    routeParams: ['PZ.', 'DUEL', 'ACCEPTX2', '147'],
    groupCode: '120363158210566822@g.us',
    playerName: 'test',
    fromReact: true,
    playerPhone: '5516988675837@c.us',
  })
  console.log({ response })
})
app.listen(4000, async () => {
  const clearDB = false
  if (clearDB) {
    await prismaClient.session.deleteMany()
    await prismaClient.item.deleteMany()
    await prismaClient.pokemon.deleteMany()
    await prismaClient.player.deleteMany()
    console.log('cleared')
  }

  console.log('pokezap is online!')
})

const enableZap = true
if (enableZap) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'ZapClientInstance1' }),
    puppeteer: {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
    ffmpegPath: './src/infra/ffmpeg/bin/ffmpeg.exe',
  })

  container.registerInstance<Client>('ZapClientInstance1', client)
  handleAllProcess(client, 'ZapClientInstance1')
  console.log('client1 is online!')
}
