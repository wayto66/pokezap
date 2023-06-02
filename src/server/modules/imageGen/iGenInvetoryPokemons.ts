import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import { logger } from 'infra/logger'
import path from 'path'

type TParams = {
  playerData: any
  page?: number
}

export const iGenInvetoryPokemons = async (data: TParams) => {
  const page = data.page ? data.page - 1 : 0
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/player_inventory_items.png'

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // draw items
  ctx.globalAlpha = 1

  let j = 0
  let k = 0

  for (let i = 0; i < Math.min(19 + page * 19, data.playerData.ownedPokemons.length); i++) {
    if (
      i === 5 ||
      i === 10 ||
      i === 15 ||
      i === 20 ||
      i === 30 ||
      i === 40 ||
      i === 45 ||
      i === 50 ||
      i === 55 ||
      i === 75 ||
      i === 80 ||
      i === 85
    ) {
      j++
      k = 0
    }

    if (!data.playerData.ownedPokemons[i + page * 19]) continue

    const x = 60 + k * 82.5
    const y = 40 + j * 107

    // set up the circle style
    const circleRadius = 15
    const circleColor = 'rgba(0,0,0,0.33)'
    // draw the circle path
    ctx.beginPath()
    ctx.arc(x + 25, y + 25, circleRadius, 0, Math.PI * 2)
    // fill the circle path with black color
    ctx.fillStyle = circleColor
    ctx.fill()

    const spriteUrl = data.playerData.ownedPokemons[i + page * 19].spriteUrl
    if (!spriteUrl) return

    const sprite = await loadImage(spriteUrl)
    ctx.drawImage(sprite, x - 12, y - 12, 75, 75)

    ctx.font = ' 14px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(`lvl: ${data.playerData.ownedPokemons[i + page * 19].level}`, x + 20, y + 80)

    ctx.font = ' 14px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'start'
    ctx.fillText(`#${data.playerData.ownedPokemons[i + page * 19].id}`, x, y + 5)

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

  // Delete the file after 5 seconds
  setTimeout(() => {
    fs.unlink(filepath, error => {
      if (error) {
        logger.error(`Failed to delete file: ${error}`)
      } else {
        logger.info('File deleted successfully.')
      }
    })
  }, 5000)

  return filepath
}
