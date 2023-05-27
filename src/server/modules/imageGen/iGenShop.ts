import { BaseItem, BaseRoomUpgrades, GameRoom, RoomUpgrades } from '@prisma/client'
import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'

type TParams = {
  items: BaseItem[]
}

export const iGenShop = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/shop1.png'

  // Load the font file and register it with the canvas
  registerFont('./src/assets/font/JosefinSans-Bold.ttf', { family: 'Pokemon' })

  registerFont('./src/assets/font/Righteous.ttf', { family: 'Righteous' })

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  let j = 0
  let k = 0

  for (let i = 0; i < data.items.length; i++) {
    if (i === 5 || i === 10 || i === 15) {
      j++
      k = 0
    }

    const x = 60 + k * 82.5
    const y = 40 + j * 110

    // set up the circle style
    const circleRadius = 25
    const circleColor = 'rgba(0,0,0,0.33)'
    // draw the circle path
    ctx.beginPath()
    ctx.arc(x + 25, y + 25, circleRadius, 0, Math.PI * 2)
    // fill the circle path with black color
    ctx.fillStyle = circleColor
    ctx.fill()

    const sprite = await loadImage(data.items[i].spriteUrl)
    ctx.drawImage(sprite, x, y, 50, 50)

    ctx.font = ' 20px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(`$${data.items[i].npcPrice}`, x + 20, y + 80)

    // draw itemid circle
    const circle2Radius = 12
    // draw the circle path
    ctx.beginPath()
    ctx.arc(x, y, circle2Radius, 0, Math.PI * 2)
    // fill the circle path with black color
    ctx.fillStyle = circleColor
    ctx.fill()

    ctx.font = ' 20px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(`${i + 1}`, x + 0, y + 7)

    k++
  }

  const filepath: string = await new Promise((resolve, reject) => {
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