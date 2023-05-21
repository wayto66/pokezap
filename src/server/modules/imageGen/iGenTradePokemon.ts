import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import { talentIdMap } from '../../../server/constants/talentIdMap'
import { IPokemon } from '../../models/IPokemon'

type TParams = {
  pokemon1: IPokemon
  pokemon2: IPokemon
}

export const iGenTradePokemon = async (data: TParams) => {
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/pokemon_breed.png'

  // Load the font file and register it with the canvas

  registerFont(
    'C:/Users/yuri_/OneDrive/Área de Trabalho/dev shit/PROJETOS/pokezap/pokezap-new/src/assets/font/Righteous.ttf',
    { family: 'Righteous' }
  )

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  const generatePoke1 = async () => {
    // Load the sprite image
    const sprite = await loadImage(data.pokemon1.baseData.defaultSpriteUrl)
    // Calculate the position of the sprite in the middle of the canvas
    const spriteWidth = 275 // replace with the actual width of the sprite
    const spriteHeight = 275 // replace with the actual height of the sprite
    const spriteX = 0
    const spriteY = 80

    // Draw the sprite on the canvas
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

    ctx.globalAlpha = 1
    const typeLabel1 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemon1.baseData.type1Name + '.png')
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel1Width = 80 // replace with the actual width of the typeLabel1
    const typeLabel1Height = 25 // replace with the actual height of the typeLabel1
    const typeLabel1X = 0
    const typeLabel1Y = 105
    // Draw the typeLabel1 on the canvas
    ctx.globalAlpha = 0.8
    ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)
    if (data.pokemon1.baseData.type2Name) {
      const typeLabel2 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemon1.baseData.type2Name + '.png')
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
      return await loadImage('./src/assets/sprites/UI/types/circle/' + name + '.png')
    }

    const talents = [
      talentIdMap.get(data.pokemon1.talentId1),
      talentIdMap.get(data.pokemon1.talentId2),
      talentIdMap.get(data.pokemon1.talentId3),
      talentIdMap.get(data.pokemon1.talentId4),
      talentIdMap.get(data.pokemon1.talentId5),
      talentIdMap.get(data.pokemon1.talentId6),
      talentIdMap.get(data.pokemon1.talentId7),
      talentIdMap.get(data.pokemon1.talentId8),
      talentIdMap.get(data.pokemon1.talentId9),
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
        if (!talent) return

        ctx.drawImage(await getTalent(talent), x, y, 30, 30)
      }
    }
  }

  const generatePoke2 = async () => {
    // Load the sprite image
    const sprite = await loadImage(data.pokemon2.baseData.defaultSpriteUrl)
    // Calculate the position of the sprite in the middle of the canvas
    const spriteWidth = 275 // replace with the actual width of the sprite
    const spriteHeight = 275 // replace with the actual height of the sprite
    const spriteX = 240
    const spriteY = 80

    // Draw the sprite on the canvas
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

    ctx.globalAlpha = 1
    const typeLabel1 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemon2.baseData.type1Name + '.png')
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel1Width = 80 // replace with the actual width of the typeLabel1
    const typeLabel1Height = 25 // replace with the actual height of the typeLabel1
    const typeLabel1X = 420
    const typeLabel1Y = 105
    // Draw the typeLabel1 on the canvas
    ctx.globalAlpha = 0.8
    ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)
    if (data.pokemon2.baseData.type2Name) {
      const typeLabel2 = await loadImage('./src/assets/sprites/UI/types/' + data.pokemon2.baseData.type2Name + '.png')
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
      return await loadImage('./src/assets/sprites/UI/types/circle/' + name + '.png')
    }

    const talents = [
      talentIdMap.get(data.pokemon2.talentId1),
      talentIdMap.get(data.pokemon2.talentId2),
      talentIdMap.get(data.pokemon2.talentId3),
      talentIdMap.get(data.pokemon2.talentId4),
      talentIdMap.get(data.pokemon2.talentId5),
      talentIdMap.get(data.pokemon2.talentId6),
      talentIdMap.get(data.pokemon2.talentId7),
      talentIdMap.get(data.pokemon2.talentId8),
      talentIdMap.get(data.pokemon2.talentId9),
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

        const talent = talents[i * 3 + j]
        if (!talent) return

        // fill the circle path with black color
        ctx.fillStyle = circleColor
        ctx.fill()
        ctx.drawImage(await getTalent(talent), x, y, 30, 30)
      }
    }
  }

  await generatePoke1()
  await generatePoke2()

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