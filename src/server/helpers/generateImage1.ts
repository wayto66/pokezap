import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'
import { IPokemon } from '../../server/models/IPokemon'

type TParams = {
  spriteUrl: string
  pokemonData: IPokemon
}

export const generateImage1 = async (data: TParams) => {
  const bg1 = './src/assets/backgrounds/city.png'
  const bg2 = './src/assets/backgrounds/forest.png'
  const bg3 = './src/assets/backgrounds/savannah.png'
  const bg4 = './src/assets/backgrounds/underwater.png'

  const bgs = [bg1, bg2, bg3, bg4]
  // Define the dimensions of the canvas and the background
  const canvasWidth = 800
  const canvasHeight = 600
  const backgroundUrl = bgs[Math.floor(Math.random() * bgs.length)]

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Load the sprite image
  const sprite = await loadImage(data.spriteUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // Calculate the position of the sprite in the middle of the canvas
  const spriteWidth = 500 // replace with the actual width of the sprite
  const spriteHeight = 500 // replace with the actual height of the sprite
  const spriteX = (canvasWidth - spriteWidth) / 2
  const spriteY = (canvasHeight - spriteHeight) / 2

  // Draw the sprite on the canvas
  ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

  const bar = await loadImage('./src/assets/sprites/UI/gui/box1.png')
  // Calculate the position of the sprite in the middle of the canvas
  const barWidth = 425 // replace with the actual width of the bar
  const barHeight = 150 // replace with the actual height of the bar
  const barX = (canvasWidth - barWidth) / 2
  const barY = canvas.height - 160
  // Draw the bar on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(bar, barX, barY, barWidth, barHeight)

  const barUp = await loadImage('./src/assets/sprites/UI/gui/box1.png')
  // Calculate the position of the sprite in the middle of the canvas
  const barUpWidth = 600 // replace with the actual width of the barUp
  const barUpHeight = 75 // replace with the actual height of the barUp
  const barUpX = (canvasWidth - barUpWidth) / 2
  const barUpY = canvas.height - canvas.height * 0.97
  // Draw the barUp on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(barUp, barUpX, barUpY, barUpWidth, barUpHeight)

  const barLeft = await loadImage('./src/assets/sprites/UI/gui/box1.png')
  // Calculate the position of the sprite in the middle of the canvas
  const barLeftWidth = 175 // replace with the actual width of the barLeft
  const barLeftHeight = 250 // replace with the actual height of the barLeft
  const barLeftX = 10
  const barLeftY = canvas.height - 260
  // Draw the barLeft on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(barLeft, barLeftX, barLeftY, barLeftWidth, barLeftHeight)

  const barRight = await loadImage('./src/assets/sprites/UI/gui/box1.png')
  // Calculate the position of the sprite in the middle of the canvas
  const barRightWidth = 150 // replace with the actual width of the barRight
  const barRightHeight = 150 // replace with the actual height of the barRight
  const barRightX = canvas.width - 160
  const barRightY = canvas.height - 160
  // Draw the barRight on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(barRight, barRightX, barRightY, barRightWidth, barRightHeight)

  ctx.globalAlpha = 1

  const typeLabel1 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemonData.type1 + '.png')
  // Calculate the position of the sprite in the middle of the canvas
  const typeLabel1Width = 180 // replace with the actual width of the typeLabel1
  const typeLabel1Height = 54 // replace with the actual height of the typeLabel1
  const typeLabel1X = canvas.width - 190
  const typeLabel1Y = canvas.height * 0.25
  // Draw the typeLabel1 on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)

  if (data.pokemonData.type2) {
    const typeLabel2 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemonData.type2 + '.png')
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel2Width = 180 // replace with the actual width of the typeLabel2
    const typeLabel2Height = 54 // replace with the actual height of the typeLabel2
    const typeLabel2X = canvas.width - 190
    const typeLabel2Y = canvas.height * 0.25 + 100
    // Draw the typeLabel2 on the canvas
    ctx.globalAlpha = 0.8
    ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height)
  }

  // write pokemon name

  ctx.font = ' 40px Pokemon'
  ctx.fillStyle = '#212427'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${data.pokemonData.name}
 `,
    canvas.width / 2,
    canvas.height * 0.125
  )

  // write pokemon level

  ctx.font = ' 50px Pokemon'
  ctx.fillStyle = '#212427'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${data.pokemonData.level}
 `,
    canvas.width - 80,
    canvas.height - 80
  )

  ctx.font = ' 20px Pokemon'
  ctx.fillStyle = '#212427'
  ctx.textAlign = 'center'
  ctx.fillText(
    `level
 `,
    canvas.width - 80,
    canvas.height - 50
  )

  // set up the table data
  const tableData = [
    ['hp:', data.pokemonData.hp.toString(), 'spAtk:', data.pokemonData.spAtk.toString()],
    ['atk:', data.pokemonData.atk.toString(), 'spDef:', data.pokemonData.spDef.toString()],
    ['def:', data.pokemonData.def.toString(), 'speed:', data.pokemonData.speed.toString()],
  ]

  // set up the table style
  const cellWidth = 100
  const cellHeight = 40
  const cellColor = '#212427'
  const cellFont = '20px Pokemon'

  // move the entire table to a new position
  const tableX = canvasWidth / 2 - cellWidth * 1.5
  const tableY = canvas.height * 0.81

  // draw the table data
  ctx.fillStyle = cellColor
  ctx.font = cellFont
  for (let i = 0; i < tableData.length; i++) {
    const rowData = tableData[i]
    for (let j = 0; j < rowData.length; j++) {
      const cellText = rowData[j]
      const x = tableX + j * cellWidth
      const y = tableY + i * cellHeight
      ctx.fillText(cellText, x, y)
    }
  }

  // draw talents

  const getTalent = async (name: string) => {
    return await loadImage('./src/assets/sprites/UI/types/circle/' + name + '.png')
  }

  const pokemonTypes = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ]

  ctx.globalAlpha = 1

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 25 + j * 50
      const y = canvas.height - 230 + i * 75

      // set up the circle style
      const circleRadius = 22
      const circleColor = '#000000'

      // draw the circle path
      ctx.beginPath()
      ctx.arc(x + 22, y + 22, circleRadius, 0, Math.PI * 2)

      // fill the circle path with black color
      ctx.fillStyle = circleColor
      ctx.fill()

      const randomIndex = Math.floor(Math.random() * 18)

      ctx.drawImage(await getTalent(pokemonTypes[randomIndex]), x, y, 40, 40)
    }
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
