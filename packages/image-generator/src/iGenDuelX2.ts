import { createCanvas, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import { talentIdMap } from '../../../common/constants/talentIdMap'
import { Player, Pokemon } from '../../../common/types/prisma'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { logger } from './helpers/logger'

type DuelPlayer = Player & {
  teamPoke1: Pokemon | null
  teamPoke2: Pokemon | null
}

type TParams = {
  player1: DuelPlayer
  player2: DuelPlayer
}

export const iGenDuelX2 = async (data: TParams) => {
  if (!data.player1.teamPoke1 || !data.player1.teamPoke2) throw new Error('igenduelx2 teampoke player1')
  if (!data.player2.teamPoke1 || !data.player2.teamPoke2) throw new Error('igenduelx2 teampoke player2')
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/duel_x1.png'

  // Load the font file and register it with the canvas
  registerFont(
    'C:/Users/yuri_/OneDrive/Área de Trabalho/dev shit/PROJETOS/pokezap/POKEZAP/src/assets/font/Righteous.ttf',
    { family: 'Pokemon' }
  )

  // Load the background image
  const background = await loadOrSaveImageFromCache(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // draw image avatar
  const sprite = await loadOrSaveImageFromCache('./src/assets/sprites/avatars/' + data.player1.spriteUrl)
  const spriteWidth = 200
  const spriteHeight = 200
  const spriteX = 0
  const spriteY = 90
  ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

  // write player name
  ctx.font = '21px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'
  ctx.fillText(`${data.player1.name.toUpperCase()}`, 5, 55)

  // write player rank
  ctx.font = '14px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'
  ctx.fillText(`RANK: ${data.player1.elo}`, 51, 75)

  // draw poke sprite
  const pokeSprite1 = await loadOrSaveImageFromCache(data.player1.teamPoke1.spriteUrl)
  ctx.drawImage(pokeSprite1, -30, 275, 200, 200)

  // draw poke sprite
  const pokeSprite1b = await loadOrSaveImageFromCache(data.player1.teamPoke2.spriteUrl)
  ctx.drawImage(pokeSprite1b, 65, 275, 200, 200)

  // write poke id
  ctx.font = '16px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'
  ctx.fillText(`#${data.player1.teamPoke1.id}`, 5, 345)
  ctx.fillText(`#${data.player1.teamPoke2.id}`, 5, 320)

  // draw talents

  const getTalent = async (name: string) => {
    return await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/circle/' + name + '.png')
  }

  const talents = [
    talentIdMap.get(data.player1.teamPoke1.talentId1),
    talentIdMap.get(data.player1.teamPoke1.talentId2),
    talentIdMap.get(data.player1.teamPoke1.talentId3),
    talentIdMap.get(data.player1.teamPoke1.talentId4),
    talentIdMap.get(data.player1.teamPoke1.talentId5),
    talentIdMap.get(data.player1.teamPoke1.talentId6),
    talentIdMap.get(data.player1.teamPoke1.talentId7),
    talentIdMap.get(data.player1.teamPoke1.talentId8),
    talentIdMap.get(data.player1.teamPoke1.talentId9),
  ]

  ctx.globalAlpha = 1

  for (let i = 0; i < 9; i++) {
    const x = 5 + i * 20
    const y = 470

    const talent = talents[i]
    if (!talent) return

    ctx.drawImage(await getTalent(talent), x, y, 18, 18)
  }

  /// ////////////// PLAYER 2 /////////////////////////////
  /// ///////////////////////////////////////////////////
  /// ////////////////////////////////////////////////////

  // draw image avatar
  const sprite2 = await loadOrSaveImageFromCache('./src/assets/sprites/avatars/' + data.player2.spriteUrl)
  const sprite2Width = 200
  const sprite2Height = 200
  const sprite2X = 300
  const sprite2Y = 90
  ctx.drawImage(sprite2, sprite2X, sprite2Y, sprite2Width, sprite2Height)

  // write player name
  ctx.font = '21px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'end'
  ctx.fillText(`${data.player2.name.toUpperCase()}`, 495, 55)

  // write player rank
  ctx.font = '14px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'end'
  ctx.fillText(`RANK: ${data.player2.elo}`, 450, 75)

  // draw poke sprite
  const pokeSprite2 = await loadOrSaveImageFromCache(data.player2.teamPoke1.spriteUrl)
  ctx.drawImage(pokeSprite2, 275, 275, 200, 200)
  // draw poke sprite
  const pokeSprite2b = await loadOrSaveImageFromCache(data.player2.teamPoke2.spriteUrl)
  ctx.drawImage(pokeSprite2b, 310, 275, 200, 200)

  // write poke id
  ctx.font = '16px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'end'
  ctx.fillText(`#${data.player2.teamPoke1.id}`, 495, 345)
  ctx.fillText(`#${data.player2.teamPoke2.id}`, 495, 320)

  // draw talents

  const talents2 = [
    talentIdMap.get(data.player2.teamPoke1.talentId1),
    talentIdMap.get(data.player2.teamPoke1.talentId2),
    talentIdMap.get(data.player2.teamPoke1.talentId3),
    talentIdMap.get(data.player2.teamPoke1.talentId4),
    talentIdMap.get(data.player2.teamPoke1.talentId5),
    talentIdMap.get(data.player2.teamPoke1.talentId6),
    talentIdMap.get(data.player2.teamPoke1.talentId7),
    talentIdMap.get(data.player2.teamPoke1.talentId8),
    talentIdMap.get(data.player2.teamPoke1.talentId9),
  ]

  ctx.globalAlpha = 1

  for (let i = 0; i < 9; i++) {
    const x = 320 + i * 20
    const y = 470

    const talent = talents2[i]
    if (!talent) return

    ctx.drawImage(await getTalent(talent), x, y, 18, 18)
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

  removeFileFromDisk(filepath)

  return filepath
}
