import { createCanvas, loadOrSaveImageFromCache } from 'canvas'
import fs from 'fs'
import path from 'path'
import { logger } from './helpers/fileHelper'

export const iGenTest = async () => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/ranking.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)
  const sprite = await loadOrSaveImageFromCache(
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
  )

  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background image onto the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // Create a canvas for the silhouette
  const silhouetteCanvas = createCanvas(canvasWidth, canvasHeight)
  const silhouetteCtx = silhouetteCanvas.getContext('2d')

  // Draw the Pokemon sprite image onto the silhouette canvas
  silhouetteCtx.drawImage(sprite, 0, 0, canvasWidth, canvasHeight)

  // Get the pixel data of the silhouette canvas
  const imageData = silhouetteCtx.getImageData(0, 0, canvasWidth, canvasHeight)
  const data = imageData.data

  // Iterate through the pixels and set the inside of the sprite to white
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]

    // Check if the pixel is part of the sprite (non-transparent)
    if (alpha !== 0) {
      // Set the pixel color to white
      data[i] = 255 // Red
      data[i + 1] = 255 // Green
      data[i + 2] = 255 // Blue
      // The alpha value remains unchanged
    }
  }

  // Update the modified pixel data on the silhouette canvas
  silhouetteCtx.putImageData(imageData, 0, 0)

  // Composite the silhouette canvas onto the background canvas
  ctx.drawImage(silhouetteCanvas, 0, 0, canvasWidth, canvasHeight)

  const filepath: string = await new Promise(resolve => {
    // Save the canvas to disk
    const filename = `images/image.png`
    const filepath = path.join(__dirname, filename)
    const out = fs.createWriteStream(filepath)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () => {
      logger.info('The PNG file was created.')
      resolve(filepath)
    })
  })

  return filepath
}
