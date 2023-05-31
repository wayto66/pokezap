import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { handleAllProcess } from './server/process'
import { iGenPokemonAnalysis } from './server/modules/imageGen/iGenPokemonAnalysis'
import { registerFonts } from './server/helpers/registerFonts'

process.on('uncaughtException', error => {
  console.error(error)
})

registerFonts()

const prismaClient = new PrismaClient()
container.registerInstance<PrismaClient>('PrismaClient', prismaClient)
prismaClient.message.deleteMany()

const app = express()
app.get('/', async () => {
  const poke = await prismaClient.pokemon.findFirst({
    where: {
      id: 2227,
    },
    include: {
      baseData: true,
    },
  })
  if (poke) {
    await iGenPokemonAnalysis({
      pokemonData: poke,
    })
  }
})

app.listen(4000, async () => {
  console.log('pokezap is online!')
  await prismaClient.player.updateMany({
    where: {
      OR: [{ id: 24 }, { id: 26 }],
    },
    data: {
      energy: 20,
    },
  })
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
