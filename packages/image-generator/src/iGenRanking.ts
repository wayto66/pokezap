import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type RankEntry = {
  name: string
  value: string | number
  id: number | string
}

type TParams = {
  rankEntries: RankEntry[]
  rankingTitle: string
  playerName?: string
  playerValue?: string
  startOffset?: number
  endOffset?: number
}

export const iGenRanking = async (data: TParams) => {
  const { rankEntries, rankingTitle, startOffset, endOffset, playerValue, playerName } = data
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/ranking.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  ctx.font = ' 30px Pokemon'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText(rankingTitle, 250, 75)

  ctx.font = ' 14px Pokemon'
  ctx.textAlign = 'start'

  for (let i = startOffset || 0; i < Math.min(rankEntries.length, endOffset || 10); i++) {
    ctx.fillText('#' + rankEntries[i].id + ' ' + rankEntries[i].name, 120, 125 + i * 32)
    ctx.fillText(rankEntries[i].value.toString(), 410, 125 + i * 32)
  }

  const playerPosition = rankEntries.findIndex(entry => entry.name === playerName) + 1

  if (playerName && playerValue) {
    ctx.font = ' 20px Pokemon'
    ctx.fillText(playerPosition.toString(), 45, 466)
    ctx.font = ' 14px Pokemon'
    ctx.fillText(playerName, 120, 466)
    ctx.fillText(playerValue.toString(), 410, 466)
  }

  const filepath: string = await new Promise(resolve => {
    // Save the canvas to disk
    const filename = `images/image-${Math.random()}.png`
    const filepath = path.join(__dirname, filename)
    const out = fs.createWriteStream(filepath)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () => {
      logger.info('The PNG file was created.')
      resolve(filepath)
    })
  })

  removeFileFromDisk(filepath, 11000)

  return filepath
}
