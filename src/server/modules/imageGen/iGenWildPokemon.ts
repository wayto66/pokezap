import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import { logger } from 'infra/logger'
import path from 'path'
import { talentIdMap } from '../../../server/constants/talentIdMap'
import { IPokemon } from '../../../server/models/IPokemon'

type TParams = {
  pokemonData: IPokemon | any
}

export const iGenWildPokemon = async (data: TParams) => {
  const bg1 = './src/assets/backgrounds/city.png'
  const bg2 = './src/assets/backgrounds/forest.png'
  const bg3 = './src/assets/backgrounds/savannah.png'
  const bg4 = './src/assets/backgrounds/underwater.png'

  const bgs = [bg1, bg2, bg3, bg4]
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = bgs[Math.floor(Math.random() * bgs.length)]

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Load the sprite image
  const sprite = await loadImage(data.pokemonData.spriteUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // Calculate the position of the sprite in the middle of the canvas
  const spriteWidth = 500 // replace with the actual width of the sprite
  const spriteHeight = 500 // replace with the actual height of the sprite
  const spriteX = (canvasWidth - spriteWidth) / 2
  const spriteY = (canvasHeight - spriteHeight) / 2

  // Draw the sprite on the canvas
  ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

  const bar = await loadImage('./src/assets/sprites/UI/hud/pokemon_wild_encounter.png')
  // Calculate the position of the sprite in the middle of the canvas
  const barWidth = 500 // replace with the actual width of the bar
  const barHeight = 500 // replace with the actual height of the bar
  const barX = 0
  const barY = 0
  // Draw the bar on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(bar, barX, barY, barWidth, barHeight)

  ctx.globalAlpha = 1

  const typeLabel1 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemonData.baseData.type1Name + '.png')
  // Calculate the position of the sprite in the middle of the canvas
  const typeLabel1Width = 100 // replace with the actual width of the typeLabel1
  const typeLabel1Height = 31 // replace with the actual height of the typeLabel1
  const typeLabel1X = canvas.width - 100
  const typeLabel1Y = 105
  // Draw the typeLabel1 on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)

  if (data.pokemonData.baseData.type2Name) {
    const typeLabel2 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemonData.baseData.type2Name + '.png')
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel2Width = 100 // replace with the actual width of the typeLabel2
    const typeLabel2Height = 31 // replace with the actual height of the typeLabel2
    const typeLabel2X = canvas.width - 100
    const typeLabel2Y = 140
    // Draw the typeLabel2 on the canvas
    ctx.globalAlpha = 1
    ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height)
  }

  // write pokemon name

  const name = `#${data.pokemonData.id} ${data.pokemonData.baseData.name.toUpperCase()} `
  ctx.font = 30 - name.length / 3 + 'px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'

  ctx.fillText(name, 10, 70)

  // write pokemon level

  ctx.font = ' 50px Pokemon'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${data.pokemonData.level}
 `,
    450,
    65
  )

  ctx.font = ' 20px Pokemon'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText(
    `level
 `,
    450,
    85
  )

  // set up the table data
  const tableData = [
    [data.pokemonData.hp.toString(), data.pokemonData.atk.toString(), data.pokemonData.def.toString()],

    [data.pokemonData.speed.toString(), data.pokemonData.spAtk.toString(), data.pokemonData.spDef.toString()],
  ]

  // set up the table style
  const cellWidth = 80
  const cellHeight = 55
  const cellColor = '#212427'
  const cellFont = '15px Pokemon'

  // move the entire table to a new position
  const tableX = 290
  const tableY = 412

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

  const talents = [
    talentIdMap.get(data.pokemonData.talentId1),
    talentIdMap.get(data.pokemonData.talentId2),
    talentIdMap.get(data.pokemonData.talentId3),
    talentIdMap.get(data.pokemonData.talentId4),
    talentIdMap.get(data.pokemonData.talentId5),
    talentIdMap.get(data.pokemonData.talentId6),
    talentIdMap.get(data.pokemonData.talentId7),
    talentIdMap.get(data.pokemonData.talentId8),
    talentIdMap.get(data.pokemonData.talentId9),
  ]

  ctx.globalAlpha = 1

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const x = 22 + j * 40
      const y = canvas.height - 180 + i * 60

      // set up the circle style
      const circleRadius = 14
      const circleColor = 'rgba(0,0,0,0.5)'

      // draw the circle path
      ctx.beginPath()
      ctx.arc(x + 21, y + 21, circleRadius, 0, Math.PI * 2)

      // fill the circle path with black color
      ctx.fillStyle = circleColor
      ctx.fill()
      const talent = talents[i * 3 + j]

      if (!talent) {
        logger.error('invalid talents: ' + [i * 3 + j])
        return
      }
      ctx.drawImage(await getTalent(talent), x, y, 30, 30)
    }
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
  }, 60000)

  return filepath
}
