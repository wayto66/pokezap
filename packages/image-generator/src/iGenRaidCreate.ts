import { Image, createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'
import { BaseItem, BasePokemon } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  boss: BasePokemon
  enemyPokemons: BasePokemon[]
  backgroundName: string
  possibleLoot: BaseItem[]
}

export const iGenRaidCreate = async (data: TParams) => {
  const canvasWidth = 500
  const canvasHeight = 500
  const { boss, backgroundName, enemyPokemons } = data
  const hudUrl = './src/assets/sprites/UI/raid/hud.png'
  const backgroundUrl = `./src/assets/sprites/UI/raid/${backgroundName}.png`

  // Load the hud image
  const hud = await loadOrSaveImageFromCache(hudUrl)
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Load the sprite image
  const sprite = await loadOrSaveImageFromCache(boss.defaultSpriteUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the hud on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)
  ctx.drawImage(hud, 0, 0, canvasWidth, canvasHeight)

  // Calculate the position of the sprite in the middle of the canvas
  const spriteWidth = 350 // replace with the actual width of the sprite
  const spriteHeight = 350 // replace with the actual height of the sprite
  const spriteX = (canvasWidth - spriteWidth) / 2
  const spriteY = (canvasHeight - spriteHeight) / 2 - 20

  // Draw the sprite on the canvas
  ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

  ctx.globalAlpha = 1

  const typeLabel1 = await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/' + boss.type1Name + '.png')
  // Calculate the position of the sprite in the middle of the canvas
  const typeLabel1Width = 100 // replace with the actual width of the typeLabel1
  const typeLabel1Height = 31 // replace with the actual height of the typeLabel1
  const typeLabel1X = 0
  const typeLabel1Y = 105
  // Draw the typeLabel1 on the canvas
  ctx.globalAlpha = 0.8
  ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height)

  if (boss.type2Name) {
    const typeLabel2 = await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/' + boss.type2Name + '.png')
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel2Width = 100 // replace with the actual width of the typeLabel2
    const typeLabel2Height = 31 // replace with the actual height of the typeLabel2
    const typeLabel2X = 400
    const typeLabel2Y = 105
    // Draw the typeLabel2 on the canvas
    ctx.globalAlpha = 1
    ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height)
  }

  // write boss name

  ctx.font = '31px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'

  ctx.fillText(`RAID: ${boss.name.toUpperCase()}`, 250, 70)
  ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid'

  const lootImageMap = new Map<string, Image>([])
  for (const item of data.possibleLoot) {
    lootImageMap.set(item.name, await loadOrSaveImageFromCache(item.spriteUrl))
  }
  for (let i = 0; i < data.possibleLoot.length; i++) {
    const x = 170 + i * 50
    const y = 415
    const item = lootImageMap.get(data.possibleLoot[i].name)
    if (!item) return
    ctx.drawImage(item, x, y, 45, 45)
  }

  const pokemonsImageMap = new Map<string, Image>([])
  for (const pokemon of enemyPokemons) {
    if (pokemonsImageMap.get(pokemon.name)) continue
    pokemonsImageMap.set(pokemon.name, await loadOrSaveImageFromCache(pokemon.defaultSpriteUrl))
  }
  for (let i = 0; i < enemyPokemons.length; i++) {
    const x = i < 3 ? 0 : 430
    const y = i < 3 ? 150 + i * 125 : 150 + (i - 3) * 125
    const poke = pokemonsImageMap.get(enemyPokemons[i].name)
    if (!poke) return
    ctx.drawImage(poke, x, y, 60, 60)
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
