import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { BasePokemon, Pokemon } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  pokemons: (Pokemon & {
    baseData: BasePokemon
  })[]
  remainingHoursMap: Map<number, number>
}

export const iGenDaycareInfo = async (data: TParams) => {
  const { pokemons } = data
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/daycare.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  let j = 0
  let k = 0

  for (let i = 0; i < pokemons.length; i++) {
    if (i === 3 || i === 6 || i === 9) {
      j++
      k = 0
    }

    const x = 60 + k * 140
    const y = 45 + j * 145

    const sprite = await loadOrSaveImageFromCache(pokemons[i].spriteUrl)
    ctx.drawImage(sprite, x, y, 90, 90)

    const hoursLeft = data.remainingHoursMap.get(pokemons[i].id)
    if (!hoursLeft) continue

    const message = hoursLeft < 0 ? 'PRONTO' : hoursLeft?.toFixed(2) + 'h'

    ctx.font = ' 13px Pokemon'
    ctx.fillStyle = hoursLeft < 0 ? 'green' : 'white'
    ctx.textAlign = 'start'
    ctx.fillText(`#${pokemons[i].id} - ${message}`, x, y + 95)
    k++
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
