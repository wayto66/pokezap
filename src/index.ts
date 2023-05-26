import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { handleAllProcess } from './server/process'
import { duelX1 } from './server/modules/duel/duelX1'

process.on('uncaughtException', error => {
  console.error(error)
})

const prismaClient = new PrismaClient()
container.registerInstance<PrismaClient>('PrismaClient', prismaClient)
prismaClient.message.deleteMany()

const app = express()
app.get('/', async () => {
  const pokemons = await prismaClient.pokemon.findMany({
    where: {
      OR: [
        { id: 1331 },
        {
          id: 1332,
        },
      ],
    },
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  })

  if (!pokemons) return

  const res = await duelX1({
    poke1: pokemons[0],
    poke2: pokemons[1],
  })

  if (res) console.log(res.message)
})
app.listen(4000, async () => {
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
