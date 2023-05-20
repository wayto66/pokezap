import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'

type TParams = {
  playerData: any
}

export const iGenInventoryItems = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/player_inventory_items.png'

  // Load the font file and register it with the canvas
  registerFont(
    'C:/Users/yuri_/OneDrive/Área de Trabalho/dev shit/PROJETOS/pokezap/pokezap-new/src/assets/font/Righteous.ttf',
    { family: 'Pokemon' }
  )

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

  for (let i = 0; i < data.playerData.ownedItems.length; i++) {
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

    const sprite = await loadImage(data.playerData.ownedItems[i].baseItem.spriteUrl)
    ctx.drawImage(sprite, x, y, 50, 50)

    ctx.font = ' 20px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(`${data.playerData.ownedItems[i].amount}`, x + 20, y + 80)

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
  }, 5000)

  return filepath
}
