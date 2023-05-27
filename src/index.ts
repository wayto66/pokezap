import { PrismaClient } from '@prisma/client'
import express from 'express'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { Client, LocalAuth } from 'whatsapp-web.js'
import { handleAllProcess } from './server/process'
import { duelX1 } from './server/modules/duel/duelX1'
import { iGenRanking } from './server/modules/imageGen/iGenRanking'

process.on('uncaughtException', error => {
  console.error(error)
})

const prismaClient = new PrismaClient()
container.registerInstance<PrismaClient>('PrismaClient', prismaClient)
prismaClient.message.deleteMany()

const app = express()
app.get('/', async () => {
  const players = await prismaClient.player.findMany()
  if (!players) return

  const player = await prismaClient.player.findFirst()
  if (!player) return
  const sortedPlayers = players.sort((a, b) => b.elo - a.elo)

  const rankEntries: any = []

  for (const player of sortedPlayers) {
    const playerInfo = {
      id: player.id,
      name: player.name,
      value: player.elo,
    }
    rankEntries.push(playerInfo)
  }

  await iGenRanking({
    rankEntries,
    rankingTitle: 'Ranking ELO',
    playerName: player.name,
    playerValue: player.elo.toString(),
  })
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
