import { Image, createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { pokemonTypes } from '../../../common/constants/pokemonTypes'
import { talentIdMap } from '../../../common/constants/talentIdMap'
import { PokemonBaseDataSkillsHeld } from '../../../common/types'
import { removeFileFromDisk } from './helpers/fileHelper'
import { getHoursDifference } from './helpers/getHoursDifference'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  pokemons: PokemonBaseDataSkillsHeld[]
}

export const iGenInventoryPokemons = async (data: TParams) => {
  const { pokemons } = data
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/pokemon_inventory.png'
  const tmSpriteUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  const talentImageMap = new Map<string, Image>([])
  for (const type of pokemonTypes) {
    talentImageMap.set(type, await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/circle/' + type + '.png'))
  }

  let j = 0
  let k = 0

  for (let i = 0; i < 20; i++) {
    if (i !== 0 && i % 4 === 0) {
      j++
      k = 0
    }

    if (!pokemons[i]) continue

    const childrenCount = [
      pokemons[i].childrenId1,
      pokemons[i].childrenId2,
      pokemons[i].childrenId3,
      pokemons[i].childrenId4,
    ].filter(v => v !== null).length

    const x = 13 + k * 126
    const y = 10 + j * 97

    const spriteUrl = pokemons[i].spriteUrl
    if (!spriteUrl) return

    const sprite = await loadOrSaveImageFromCache(spriteUrl)
    ctx.drawImage(sprite, x - 12, y - 12, 75, 75)

    ctx.font = ' 9px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'end'
    ctx.fillText(`Lv: ${pokemons[i].level}| Ovos: ${childrenCount}`, x + 105, y + 75)

    ctx.font = ' 12px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'start'
    ctx.fillText(`#${pokemons[i].id}`, x - 5, y + 75)

    if (pokemons[i].heldItem) {
      ctx.beginPath()
      ctx.arc(x + 48, y + 48, 9, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(250,250,250,0.75)'
      ctx.fill()
      const spUrl = pokemons[i].heldItem!.baseItem.spriteUrl
      const heldItemSprite = await loadOrSaveImageFromCache(spUrl)
      ctx.drawImage(heldItemSprite, x + 41, y + 41, 15, 15)
    }

    if (pokemons[i].TMs > 0) {
      const tmSprite = await loadOrSaveImageFromCache(tmSpriteUrl)
      ctx.globalAlpha = 1
      // Draw the tmSprite on the canvas
      for (let k = 0; k < pokemons[k].TMs; k++) {
        ctx.drawImage(tmSprite, x + 41 - k * 9, y + 5, 15, 15)
      }
    }

    if (pokemons[i].isAdult) {
      ctx.font = ' 9px Pokemon'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'start'
      ctx.fillText(pokemons[i].baseData.name, x, y + 60)

      const type1Image = talentImageMap.get(pokemons[i].baseData.type1Name)
      if (!type1Image) continue
      ctx.drawImage(type1Image, x + 65, y, 14, 14)

      const type2Image = talentImageMap.get(pokemons[i].baseData.type2Name ?? pokemons[i].baseData.type1Name)
      if (!type2Image) continue
      ctx.drawImage(type2Image, x + 82, y, 14, 14)

      // draw talents

      for (let i2 = 0; i2 < 3; i2++) {
        for (let j = 0; j < 3; j++) {
          const talentX = x + 66 + j * 10
          const talentY = y + 25 + i2 * 10

          const talentIndex = 'talentId' + (1 + 3 * i2 + j)
          const talentName = talentIdMap.get((pokemons as any)[i][talentIndex])
          if (!talentName) continue
          const image = talentImageMap.get(talentName)
          if (!image) continue

          ctx.drawImage(image, talentX, talentY, 10, 10)
        }
      }
    } else {
      ctx.font = ' 10px Pokemon'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'end'
      ctx.fillText((24 - getHoursDifference(pokemons[i].createdAt, new Date())).toFixed(2) + ' h', x + 90, y + 35)
      ctx.fillText('restantes', x + 90, y + 50)
    }

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
