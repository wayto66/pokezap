import { BaseRoomUpgrades, GameRoom, RoomUpgrades } from '@prisma/client'
import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

type TParams = {
  route: GameRoom & {
    upgrades: RoomUpgrades[] &
      [
        {
          baseData: BaseRoomUpgrades
        }
      ]
  }
}

export const iGenRouteInfo = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/route/base.png'

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  for (const upgrade of data.route.upgrades) {
    const sprite1 = await loadImage(`./src/assets/sprites/route/${upgrade.baseData.name}.png`)
    ctx.drawImage(sprite1, 0, 0, canvasWidth, canvasHeight)
  }

  const sprite1 = await loadImage('./src/assets/sprites/route/roads.png')
  ctx.drawImage(sprite1, 0, 0, canvasWidth, canvasHeight)

  const sprite2 = await loadImage('./src/assets/sprites/route/trees.png')
  ctx.drawImage(sprite2, 0, 0, canvasWidth, canvasHeight)

  const sprite3 = await loadImage('./src/assets/sprites/route/gym.png')
  ctx.drawImage(sprite3, 0, 0, canvasWidth, canvasHeight)

  const sprite4 = await loadImage('./src/assets/sprites/route/bridge.png')
  ctx.drawImage(sprite4, 0, 0, canvasWidth, canvasHeight)

  const sprite5 = await loadImage('./src/assets/sprites/route/ship.png')
  ctx.drawImage(sprite5, 0, 0, canvasWidth, canvasHeight)

  const filepath: string = await new Promise(resolve => {
    // Save the canvas to disk
    const filename = `images/image-${Math.random()}.png`
    const filepath = path.join(__dirname, filename)
    const out = fs.createWriteStream(filepath)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () => {
      console.log('The PNG file was created.')
      resolve(filepath)
    })
  })

  // Delete the file after 5 seconds
  setTimeout(() => {
    fs.unlink(filepath, error => {
      if (error) {
        console.error(`Failed to delete file: ${error}`)
      } else {
        console.log('File deleted successfully.')
      }
    })
  }, 11000)

  return filepath
}
