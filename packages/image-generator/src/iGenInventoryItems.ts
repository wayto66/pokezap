import { createCanvas } from 'canvas'
import fs from 'fs'
import path from 'path'

import { BaseItem, BasePokemon, HeldItem, Item, Player, Pokemon } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type TParams = {
  playerData: Player & {
    ownedItems: (Item & {
      baseItem: BaseItem
    })[]
    ownedPokemons: (Pokemon & {
      baseData: BasePokemon
      heldItem:
        | (HeldItem & {
            baseItem: BaseItem
          })
        | null
    })[]
  }
}

export const iGenInventoryItems = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/player_inventory_items.png'

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // draw items
  ctx.globalAlpha = 1

  let j = 0
  let k = 0

  const items = data.playerData.ownedItems
  const heldItems = data.playerData.ownedPokemons.map(poke => {
    if (poke.heldItem)
      return {
        name: poke.heldItem.name,
        baseItem: {
          spriteUrl: poke.heldItem.baseItem.spriteUrl,
        },
        ownerName: poke.baseData.name,
        ownerId: poke.id,
        ownerSpriteUrl: poke.spriteUrl,
        isHeld: true,
        amount: 1,
      }

    return null
  })

  let totalItems: any = items
  if (items.length < 19 - heldItems.length) totalItems = [items, heldItems].flat().filter(item => item !== undefined)
  if (!totalItems) throw new Error('igenvinetoryitems')

  for (let i = 0; i < totalItems.length; i++) {
    if (!totalItems[i]) continue
    if (i === 5 || i === 10 || i === 15) {
      j++
      k = 0
    }

    const x = 60 + k * 82.5
    const y = 40 + j * 108

    // set up the circle style
    const circleRadius = 25
    const circleColor = 'rgba(0,0,0,0.33)'
    // draw the circle path
    ctx.beginPath()
    ctx.arc(x + 25, y + 25, circleRadius, 0, Math.PI * 2)
    // fill the circle path with black color
    ctx.fillStyle = circleColor
    ctx.fill()

    const sprite = await loadOrSaveImageFromCache(totalItems[i]!.baseItem.spriteUrl)
    ctx.drawImage(sprite, x, y, 50, 50)

    if ('ownerSpriteUrl' in totalItems[i]!) {
      const sprite = await loadOrSaveImageFromCache(totalItems[i]!.ownerSpriteUrl)
      ctx.drawImage(sprite, x, y + 40, 45, 45)
      k++
      continue
    }

    if ('amount' in totalItems[i]!) {
      ctx.font = ' 20px Pokemon'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.fillText(`${totalItems[i]!.amount}`, x + 20, y + 80)
      k++
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

  removeFileFromDisk(filepath, 55000)

  return filepath
}
