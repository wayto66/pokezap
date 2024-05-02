import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { BaseRoomUpgrades, GameRoom, RoomUpgrades } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  route: GameRoom & {
    upgrades: (RoomUpgrades & {
      base: BaseRoomUpgrades
    })[]
  }
}

export const iGenRouteInfo = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/route/base.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  for (const upgrade of data.route.upgrades) {
    const sprite1 = await loadOrSaveImageFromCache(`./src/assets/sprites/route/${upgrade.base.name}.png`)
    ctx.drawImage(sprite1, 0, 0, canvasWidth, canvasHeight)
  }

  const sprite2 = await loadOrSaveImageFromCache('./src/assets/sprites/route/trees.png')
  ctx.drawImage(sprite2, 0, 0, canvasWidth, canvasHeight)

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
