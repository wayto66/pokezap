import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { BasePokemon, Pokemon, Talent } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  pokemon1: Pokemon & {
    baseData: BasePokemon
    talent1: Talent
    talent2: Talent
    talent3: Talent
    talent4: Talent
    talent5: Talent
    talent6: Talent
    talent7: Talent
    talent8: Talent
    talent9: Talent
  }
  pokemon2: Pokemon & {
    baseData: BasePokemon
    talent1: Talent
    talent2: Talent
    talent3: Talent
    talent4: Talent
    talent5: Talent
    talent6: Talent
    talent7: Talent
    talent8: Talent
    talent9: Talent
  }
}

export const iGenPokemonBreed = async (data: TParams) => {
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/pokemon_breed.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  const generatePoke1 = async () => {
    // Load the sprite image
    const sprite = await loadOrSaveImageFromCache(data.pokemon1.spriteUrl)
    // Calculate the position of the sprite in the middle of the canvas
    const spriteWidth = 275 // replace with the actual width of the sprite
    const spriteHeight = 275 // replace with the actual height of the sprite
    const spriteX = 0
    const spriteY = 80

    // Draw the sprite on the canvas
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

    ctx.globalAlpha = 1
    const typeLabel1 = await loadOrSaveImageFromCache(
      './src/assets/sprites/UI/types/' + data.pokemon1.baseData.type1Name + '.png'
    )
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel1Width = 80 // replace with the actual width of the typeLabel1
    const typeLabel1Height = 25 // replace with the actual height of the typeLabel1
    const typeLabel1X = 0
    const typeLabel1Y = 105
    // Draw the typeLabel1 on the canvas
    ctx.globalAlpha = 0.8
    ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)
    if (data.pokemon1.baseData.type2Name) {
      const typeLabel2 = await loadOrSaveImageFromCache(
        './src/assets/sprites/UI/types/' + data.pokemon1.baseData.type2Name + '.png'
      )
      // Calculate the position of the sprite in the middle of the canvas
      const typeLabel2Width = 80 // replace with the actual width of the typeLabel2
      const typeLabel2Height = 25 // replace with the actual height of the typeLabel2
      const typeLabel2X = 0
      const typeLabel2Y = 140
      // Draw the typeLabel2 on the canvas
      ctx.globalAlpha = 1
      ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height)
    }

    // write pokemon name

    const name = data.pokemon1.baseData.name
    const nameLength = name.length

    ctx.font = Math.round(30 - nameLength * 0.85) + 'px Righteous'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'start'

    ctx.fillText(`#${data.pokemon1.id} ${data.pokemon1.baseData.name.toUpperCase()}`, 10, 70)
    ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid'
    ctx.lineWidth = 2

    // draw talents

    const getTalent = async (name: string) => {
      return await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/circle/' + name + '.png')
    }

    const talents = [
      data.pokemon1.talent1.typeName,
      data.pokemon1.talent2.typeName,
      data.pokemon1.talent3.typeName,
      data.pokemon1.talent4.typeName,
      data.pokemon1.talent5.typeName,
      data.pokemon1.talent6.typeName,
      data.pokemon1.talent7.typeName,
      data.pokemon1.talent8.typeName,
      data.pokemon1.talent9.typeName,
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

        Math.floor(Math.random() * 18)

        ctx.drawImage(await getTalent(talents[i * 3 + j]), x, y, 30, 30)
      }
    }
  }

  const generatePoke2 = async () => {
    // Load the sprite image
    const sprite = await loadOrSaveImageFromCache(data.pokemon2.spriteUrl)
    // Calculate the position of the sprite in the middle of the canvas
    const spriteWidth = 275 // replace with the actual width of the sprite
    const spriteHeight = 275 // replace with the actual height of the sprite
    const spriteX = 240
    const spriteY = 80

    // Draw the sprite on the canvas
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

    ctx.globalAlpha = 1
    const typeLabel1 = await loadOrSaveImageFromCache(
      './src/assets/sprites/UI/types/' + data.pokemon2.baseData.type1Name + '.png'
    )
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel1Width = 80 // replace with the actual width of the typeLabel1
    const typeLabel1Height = 25 // replace with the actual height of the typeLabel1
    const typeLabel1X = 420
    const typeLabel1Y = 105
    // Draw the typeLabel1 on the canvas
    ctx.globalAlpha = 0.8
    ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)
    if (data.pokemon2.baseData.type2Name) {
      const typeLabel2 = await loadOrSaveImageFromCache(
        './src/assets/sprites/UI/types/' + data.pokemon2.baseData.type2Name + '.png'
      )
      // Calculate the position of the sprite in the middle of the canvas
      const typeLabel2Width = 80 // replace with the actual width of the typeLabel2
      const typeLabel2Height = 25 // replace with the actual height of the typeLabel2
      const typeLabel2X = 420
      const typeLabel2Y = 140
      // Draw the typeLabel2 on the canvas
      ctx.globalAlpha = 1
      ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height)
    }

    // write pokemon name

    const name = data.pokemon2.baseData.name
    const nameLength = name.length

    ctx.font = Math.round(30 - nameLength * 0.85) + 'px Righteous'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'start'

    ctx.fillText(`#${data.pokemon2.id} ${name.toUpperCase()}`, 290, 70)
    ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid'
    ctx.lineWidth = 2

    // draw talents

    const getTalent = async (name: string) => {
      return await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/circle/' + name + '.png')
    }

    const talents = [
      data.pokemon2.talent1.typeName,
      data.pokemon2.talent2.typeName,
      data.pokemon2.talent3.typeName,
      data.pokemon2.talent4.typeName,
      data.pokemon2.talent5.typeName,
      data.pokemon2.talent6.typeName,
      data.pokemon2.talent7.typeName,
      data.pokemon2.talent8.typeName,
      data.pokemon2.talent9.typeName,
    ]

    ctx.globalAlpha = 1

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = 365 + j * 40
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
        ctx.drawImage(await getTalent(talents[i * 3 + j]), x, y, 30, 30)
      }
    }
  }

  await generatePoke1()
  await generatePoke2()

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

  removeFileFromDisk(filepath, 5000)

  return filepath
}
