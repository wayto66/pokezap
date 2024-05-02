import express from 'express'
import ffmpegPath from 'ffmpeg-static'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, NoAuth } from 'whatsapp-web.js'
import { logger } from './helpers/logger'
import router from './infra/router'
import { handleAllProcess } from './process'

process.on('uncaughtException', error => {
  logger.error(error?.message)
})

const app = express()
app.use(express.json())
app.use(router)

const client = new Client({
  authStrategy: new NoAuth(),
  puppeteer: {
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  },
  ffmpegPath: ffmpegPath ?? '',
  webVersionCache: {
    type: 'remote',
    remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
  },
})
handleAllProcess(client)

container.registerInstance<Client>('WhatsappClient', client)

app.listen(4002, async () => {
  logger.info('Whatsapp-provider online on 4002')
})
