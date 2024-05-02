import { Image, createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { talentIdMap } from '../../../common/constants/talentIdMap'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  playerData: any
}

export const iGenPokemonTeam = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/pokemon_team.png'

  const talentSpritesMap = new Map<number, Image>([])

  for (let i = 1; i < 19; i++) {
    const image = await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/circle/' + talentIdMap.get(i) + '.png')
    talentSpritesMap.set(i, image)
  }

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // draw items
  ctx.globalAlpha = 1

  let j = 0
  let k = 0

  const pokeTeam = [
    data.playerData.teamPoke1,
    data.playerData.teamPoke2,
    data.playerData.teamPoke3,
    data.playerData.teamPoke4,
    data.playerData.teamPoke5,
    data.playerData.teamPoke6,
  ]

  for (let i = 0; i < 6; i++) {
    if (i === 2 || i === 4) {
      j++
      k = 0
    }

    if (!pokeTeam[i]) continue

    const x = 0 + k * 245
    const y = 5 + j * 165

    // draw the circle
    const circleRadius = 35
    const circleColor = 'rgba(0,0,0,0.33)'
    ctx.beginPath()
    ctx.arc(x + 80, y + 85, circleRadius, 0, Math.PI * 2)
    ctx.fillStyle = circleColor
    ctx.fill()

    // draw the pokemon sprite
    const sprite = await loadOrSaveImageFromCache(pokeTeam[i].spriteUrl)
    ctx.drawImage(sprite, x, y, 160, 160)

    // draw the pokemon types
    const typeSprite1 = await loadOrSaveImageFromCache(
      './src/assets/sprites/UI/types/' + pokeTeam[i].baseData.type1Name + '.png'
    )
    ctx.drawImage(typeSprite1, x + 130, y + 70, 50, 25)

    if (pokeTeam[i].baseData.type2Name) {
      const typeSprite2 = await loadOrSaveImageFromCache(
        './src/assets/sprites/UI/types/' + pokeTeam[i].baseData.type2Name + '.png'
      )
      ctx.drawImage(typeSprite2, x + 180, y + 70, 50, 25)
    }

    /// draw pokemon talents

    const talents = [
      pokeTeam[i].talentId1,
      pokeTeam[i].talentId2,
      pokeTeam[i].talentId3,
      pokeTeam[i].talentId4,
      pokeTeam[i].talentId5,
      pokeTeam[i].talentId6,
      pokeTeam[i].talentId7,
      pokeTeam[i].talentId8,
      pokeTeam[i].talentId9,
    ]

    for (let i = 0; i < 5; i++) {
      const talentSprite = talentSpritesMap.get(talents[i])
      if (!talentSprite) return
      ctx.drawImage(talentSprite, x + 135 + i * 17, y + 105, 17, 17)
    }

    for (let i2 = 5; i2 < 9; i2++) {
      const talentSprite = talentSpritesMap.get(talents[i2])
      if (!talentSprite) return
      ctx.drawImage(talentSprite, x + 135 + (i2 - 5) * 23, y + 125, 17, 17)
    }

    /// draw pokemon level
    ctx.font = ' 18px Pokemon'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText(`lvl: ${pokeTeam[i].level}`, x + 110, y + 135)

    /// draw pokemon name
    ctx.font = ' 18px Pokemon'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'start'
    ctx.fillText(`${pokeTeam[i].nickName ? pokeTeam[i].nickName : pokeTeam[i].baseData.name}`, x + 135, y + 52)

    ctx.font = ' 18px Pokemon'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'start'
    ctx.fillText(`#${pokeTeam[i].id}`, x + 25, y + 41)

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

  removeFileFromDisk(filepath, 5000)

  return filepath
}
