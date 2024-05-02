import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { talentIdMap } from '../../../common/constants/talentIdMap'
import { PokemonBaseData } from '../../../common/types'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  pokemon: PokemonBaseData
}

export const iGenWildPokemon = async (data: TParams) => {
  const bg1 = `./src/assets/sprites/UI/hud/duel_bg/${data.pokemon.baseData.type1Name}.png`
  const bg2 = `./src/assets/sprites/UI/hud/duel_bg/${
    data.pokemon.baseData.type2Name || data.pokemon.baseData.type1Name
  }.png`

  const bgs = [bg1, bg2]
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = bgs[Math.floor(Math.random() * bgs.length)]

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Load the sprite image
  const sprite = await loadOrSaveImageFromCache(data.pokemon.spriteUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // Calculate the position of the sprite in the middle of the canvas
  const spriteWidth = 500 * (data.pokemon.isGiant ? 1.5 : 1) // replace with the actual width of the sprite
  const spriteHeight = 500 * (data.pokemon.isGiant ? 1.5 : 1) // replace with the actual height of the sprite
  const spriteX = (canvasWidth - spriteWidth) / 2
  const spriteY = (canvasHeight - spriteHeight) / 2

  // Draw the sprite on the canvas
  ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

  const bar = await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/pokemon_wild_encounter.png')
  // Calculate the position of the sprite in the middle of the canvas
  const barWidth = 500 // replace with the actual width of the bar
  const barHeight = 500 // replace with the actual height of the bar
  const barX = 0
  const barY = 0
  // Draw the bar on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(bar, barX, barY, barWidth, barHeight)

  ctx.globalAlpha = 1

  const typeLabel1 = await loadOrSaveImageFromCache(
    './src/assets/sprites/UI/types/' + data.pokemon.baseData.type1Name + '.png'
  )
  // Calculate the position of the sprite in the middle of the canvas
  const typeLabel1Width = 100 // replace with the actual width of the typeLabel1
  const typeLabel1Height = 31 // replace with the actual height of the typeLabel1
  const typeLabel1X = canvas.width - 100
  const typeLabel1Y = 105
  // Draw the typeLabel1 on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)

  if (data.pokemon.baseData.type2Name) {
    const typeLabel2 = await loadOrSaveImageFromCache(
      './src/assets/sprites/UI/types/' + data.pokemon.baseData.type2Name + '.png'
    )
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel2Width = 100 // replace with the actual width of the typeLabel2
    const typeLabel2Height = 31 // replace with the actual height of the typeLabel2
    const typeLabel2X = canvas.width - 100
    const typeLabel2Y = 140
    // Draw the typeLabel2 on the canvas
    ctx.globalAlpha = 1
    ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height)
  }

  if (data.pokemon.isGiant) {
    const giantLabel = await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/giant.png')
    // Calculate the position of the sprite in the middle of the canvas
    const giantLabelWidth = 100 // replace with the actual width of the giantLabel
    const giantLabelHeight = 31 // replace with the actual height of the giantLabel
    const giantLabelX = canvas.width - 100
    const giantLabelY = 175
    // Draw the giantLabel on the canvas
    ctx.globalAlpha = 1
    ctx.drawImage(giantLabel, giantLabelX, giantLabelY, giantLabelWidth, giantLabelHeight)
  }

  // write pokemon name

  const name = `#${data.pokemon.id} ${data.pokemon.baseData.name.toUpperCase()} `
  ctx.font = 30 - name.length / 3 + 'px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'

  ctx.fillText(name, 10, 70)

  // write pokemon level

  ctx.font = ' 50px Pokemon'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText(
    `${data.pokemon.level}
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
    [data.pokemon.hp.toString(), data.pokemon.atk.toString(), data.pokemon.def.toString()],

    [data.pokemon.speed.toString(), data.pokemon.spAtk.toString(), data.pokemon.spDef.toString()],
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
    return await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/circle/' + name + '.png')
  }

  const talents = [
    talentIdMap.get(data.pokemon.talentId1),
    talentIdMap.get(data.pokemon.talentId2),
    talentIdMap.get(data.pokemon.talentId3),
    talentIdMap.get(data.pokemon.talentId4),
    talentIdMap.get(data.pokemon.talentId5),
    talentIdMap.get(data.pokemon.talentId6),
    talentIdMap.get(data.pokemon.talentId7),
    talentIdMap.get(data.pokemon.talentId8),
    talentIdMap.get(data.pokemon.talentId9),
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

  removeFileFromDisk(filepath, 60000)

  return filepath
}
