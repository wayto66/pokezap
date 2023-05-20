import { PrismaClient } from '@prisma/client'
import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import { container } from 'tsyringe'

type TParams = {
  playerData: any
}

export const iGenPlayerAnalysis = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = './src/assets/sprites/UI/hud/player_info.png'

  // Load the font file and register it with the canvas
  registerFont(
    'C:/Users/yuri_/OneDrive/Área de Trabalho/dev shit/PROJETOS/pokezap/pokezap-new/src/assets/font/Righteous.ttf',
    { family: 'Pokemon' }
  )

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // draw image avatar
  const sprite = await loadImage('./src/assets/sprites/avatars/' + data.playerData.spriteUrl)
  const spriteWidth = 135
  const spriteHeight = 135
  const spriteX = 321
  const spriteY = 105
  ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)

  // write player name
  ctx.font = '21px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'
  ctx.fillText(`${data.playerData.name.toUpperCase()}`, 51, 68)

  // write player energy
  ctx.font = '21px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'
  ctx.fillText(`Energia: ${data.playerData.energy}`, 335, 68)

  // write player rank
  ctx.font = '31px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'start'
  ctx.fillText(`${data.playerData.elo}`, 356, 407)

  // write player cash
  ctx.font = '31px Righteous'
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.fillText(`$${data.playerData.cash}`, 406, 330)

  // draw items
  ctx.globalAlpha = 1

  let j = 0
  let k = 0

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const pokeTeam = [
    data.playerData.teamPoke1,
    data.playerData.teamPoke2,
    data.playerData.teamPoke3,
    data.playerData.teamPoke4,
    data.playerData.teamPoke5,
    data.playerData.teamPoke6,
  ]

  for (let i = 0; i < pokeTeam.length; i++) {
    if (i === 3) {
      j++
      k = 0
    }

    if (!pokeTeam[i]) continue

    const x = 70 + k * 75
    const y = 111 + j * 75

    // set up the circle style
    const circleRadius = 25
    const circleColor = 'rgba(0,0,0,0.33)'
    // draw the circle path
    ctx.beginPath()
    ctx.arc(x + 25, y + 25, circleRadius, 0, Math.PI * 2)
    // fill the circle path with black color
    ctx.fillStyle = circleColor
    ctx.fill()

    const sprite = await loadImage(pokeTeam[i].baseData.defaultSpriteUrl)
    ctx.drawImage(sprite, x - 12, y - 12, 75, 75)

    ctx.font = ' 14px Pokemon'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.fillText(`lvl: ${pokeTeam[i].level}`, x + 20, y + 65)

    k++
  }

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
