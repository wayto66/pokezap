import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { logger } from './infra/logger'
import { router } from './infra/routes/router'
import { registerFonts } from './server/helpers/registerFonts'
import { handleAllProcess } from './server/process'
import ffmpegPath from 'ffmpeg-static'

process.on('uncaughtException', error => {
  logger.error(error)
})

registerFonts()

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
  logger.info(response)
})

app.listen(4000, async () => {
  logger.info('pokezap is online!')
})

const enableZap = true
if (enableZap) {
  const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'ZapClientInstance1' }),
    puppeteer: {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
    ffmpegPath: ffmpegPath ?? '',
  })

  container.registerInstance<Client>('ZapClientInstance1', client)
  handleAllProcess(client, 'ZapClientInstance1')
  logger.info('client1 is online!')
}
