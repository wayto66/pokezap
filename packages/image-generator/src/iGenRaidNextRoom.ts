import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { talentIdMap } from '../../../common/constants/talentIdMap'
import { RaidPokemonBaseData } from '../../../common/types'
import { Raid } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  enemyPokemons: RaidPokemonBaseData[]
  raid: Raid
}

export const iGenRaidNextRoom = async (data: TParams) => {
  const canvasWidth = 500
  const canvasHeight = 500
  const { raid, enemyPokemons } = data
  const backgroundName = raid.imageUrl
  const hudUrl = './src/assets/sprites/UI/raid/next_room.png'
  const backgroundUrl = `./src/assets/sprites/UI/raid/${backgroundName}.png`

  // Load the hud image
  const hud = await loadOrSaveImageFromCache(hudUrl)
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the hud on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)
  ctx.drawImage(hud, 0, 0, canvasWidth, canvasHeight)

  ctx.globalAlpha = 1

  const talentSprites: any = {}

  for (let i = 0; i < enemyPokemons.length; i++) {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    const talentNames = ids.map(id => {
      return talentIdMap.get(id)
    })
    for (const talent of talentNames) {
      if (talent && !talentSprites[talent]) {
        talentSprites[talent] = await loadOrSaveImageFromCache(
          './src/assets/sprites/UI/types/circle/' + talent + '.png'
        )
      }
    }
  }

  ctx.font = '31px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'

  ctx.fillText(`${raid.name.toUpperCase()}`, 250, 70)
  ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid'

  for (let i = 0; i < enemyPokemons.length; i++) {
    const x = i < 2 ? 80 : 350
    const y = i < 2 ? 145 + i * 125 : 290 + (i - 3) * 125
    const poke = await loadOrSaveImageFromCache(enemyPokemons[i].spriteUrl)
    if (!poke) return
    ctx.drawImage(poke, x, y, 90, 90)
    for (let j = 1; j < 10; j++) {
      const talentName = (enemyPokemons[i] as any)['talentId' + j]
      if (!talentName) {
        console.log(`no talent name for ${(enemyPokemons[i] as any)['talentId' + j]}`)
        continue
      }
      const image = talentSprites[talentIdMap.get(talentName) || '']
      if (!image) {
        console.log('no image for talenidmapget: ' + talentIdMap.get(talentName))
        console.log('no image for : ' + talentSprites[talentIdMap.get(talentName) || ''])
      }
      if (image) {
        ctx.drawImage(image, x - 60 + j * 18, y + 80, 17, 17)
      }
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

  removeFileFromDisk(filepath, 5000)

  return filepath
}
