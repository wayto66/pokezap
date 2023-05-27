import { BasePokemon, Pokemon } from '@prisma/client'
import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import GIFEncoder from 'gifencoder'
import { talentIdMap } from '../../../server/constants/talentIdMap'

type duelPokemon = Pokemon & {
  baseData: BasePokemon
  skillName: string
  skillType: string
  ultimateType: string
}

type TDuelRoundData = {
  winnerPokemon: duelPokemon
  loserPokemon: duelPokemon
  roundCount: number
  duelMap: Map<number, any>
  winnerDataName: string
  loserDataName: string
}

export const iGenDuelRound = async (data: TDuelRoundData) => {
  const filepath = await new Promise<string>(async (resolve, reject) => {
    const { winnerDataName, loserDataName } = data
    const random = Math.random()

    const rightPokemon = random >= 0.5 ? data.winnerPokemon : data.loserPokemon
    const leftPokemon = random >= 0.5 ? data.loserPokemon : data.winnerPokemon

    // Define the dimensions of the canvas and the background
    const canvasWidth = 500
    const canvasHeight = 500
    const backgroundUrl = './src/assets/sprites/UI/hud/duel_x1_round.png'
    const resultBackgroundUrl = './src/assets/sprites/UI/hud/duel_x1_result.png'

    // Load the font file and register it with the canvas
    registerFont('./src/assets/font/JosefinSans-Bold.ttf', { family: 'Pokemon' })

    registerFont('./src/assets/font/Righteous.ttf', { family: 'Righteous' })

    // Create a canvas with the defined dimensions
    const canvas = createCanvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    const filepath = __dirname + `/images/animation-${Math.random()}.gif`

    // Create a new GIFEncoder instance
    const encoder = new GIFEncoder(500, 500)
    encoder.createReadStream().pipe(fs.createWriteStream(filepath))

    // draw poke1 sprite
    const rightPokeSprite = await loadImage(rightPokemon.spriteUrl)

    // draw poke2 sprite
    const leftPokeSprite = await loadImage(leftPokemon.spriteUrl)

    const winnerPokeSkillTypeSprite = await loadImage(
      './src/assets/sprites/UI/types/' + data.winnerPokemon.skillType + '.png'
    )
    const loserPokeSkillTypeSprite = await loadImage(
      './src/assets/sprites/UI/types/' + data.loserPokemon.skillType + '.png'
    )
    const winnerPokeUltimateTypeSprite = await loadImage(
      './src/assets/sprites/UI/types/' + data.winnerPokemon.ultimateType + '.png'
    )
    const loserPokeUltimateTypeSprite = await loadImage(
      './src/assets/sprites/UI/types/' + data.loserPokemon.ultimateType + '.png'
    )

    // Load the background image
    const background = await loadImage(backgroundUrl)

    // draw talents

    const getTalent = async (name: string) => {
      return await loadImage('./src/assets/sprites/UI/types/circle/' + name + '.png')
    }

    const rightPokemonTalents = [
      talentIdMap.get(rightPokemon.talentId1),
      talentIdMap.get(rightPokemon.talentId2),
      talentIdMap.get(rightPokemon.talentId3),
      talentIdMap.get(rightPokemon.talentId4),
      talentIdMap.get(rightPokemon.talentId5),
      talentIdMap.get(rightPokemon.talentId6),
      talentIdMap.get(rightPokemon.talentId7),
      talentIdMap.get(rightPokemon.talentId8),
      talentIdMap.get(rightPokemon.talentId9),
    ]

    const leftPokemonTalents = [
      talentIdMap.get(leftPokemon.talentId1),
      talentIdMap.get(leftPokemon.talentId2),
      talentIdMap.get(leftPokemon.talentId3),
      talentIdMap.get(leftPokemon.talentId4),
      talentIdMap.get(leftPokemon.talentId5),
      talentIdMap.get(leftPokemon.talentId6),
      talentIdMap.get(leftPokemon.talentId7),
      talentIdMap.get(leftPokemon.talentId8),
      talentIdMap.get(leftPokemon.talentId9),
    ]

    const drawTalents = async (talents: (string | undefined)[], xOffset: number) => {
      if (!talents) return
      for (let j = 0; j < 9; j++) {
        const x = xOffset + j * 22
        const y = 400

        // set up the circle style
        const circleRadius = 10
        const circleColor = 'rgba(0,0,0,0.5)'

        // draw the circle path
        ctx.beginPath()
        ctx.arc(x + 21, y + 21, circleRadius, 0, Math.PI * 2)

        // fill the circle path with black color
        ctx.fillStyle = circleColor
        ctx.fill()

        const talent = talents[j]

        if (!talent) return

        ctx.drawImage(await getTalent(talent), x, y, 21, 21)
      }
    }

    // Configure the GIFEncoder
    encoder.start()
    encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
    encoder.setDelay(120) // Delay between frames in milliseconds
    encoder.setQuality(10) // Image quality (lower is better)

    const framesPerRound = 4
    let round = 1
    let roundInfo = data.duelMap.get(round)
    let isDuelInProgress = true

    const winnerHpBarXOffset = random >= 0.5 ? 365 : 55
    const loserHpBarXOffset = random >= 0.5 ? 55 : 365

    for (let i = 0; i < data.roundCount * framesPerRound + 40; i++) {
      if (i > round * framesPerRound && isDuelInProgress) {
        round++
        roundInfo = data.duelMap.get(round)
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

      await drawTalents(rightPokemonTalents, 305)
      await drawTalents(leftPokemonTalents, 5)

      ctx.fillStyle = `rgb(160,40,40)`
      ctx.fillRect(
        winnerHpBarXOffset,
        108,
        Math.max(0, (roundInfo[winnerDataName].hp / roundInfo[winnerDataName].maxHp) * 125),
        7
      )

      ctx.fillStyle = `rgb(160,40,40)`
      ctx.fillRect(
        loserHpBarXOffset,
        108,
        Math.max(0, (roundInfo[loserDataName].hp / roundInfo[loserDataName].maxHp) * 125),
        7
      )

      // draw mana

      ctx.fillStyle = `rgb(50,121,211)`
      ctx.fillRect(loserHpBarXOffset - 55, 145, Math.max(0, (roundInfo[loserDataName].mana / 100) * 175), 3)

      ctx.fillStyle = `rgb(50,121,211)`
      ctx.fillRect(winnerHpBarXOffset - 55, 145, Math.max(0, (roundInfo[winnerDataName].mana / 100) * 175), 3)

      ctx.drawImage(rightPokeSprite, 285, 165, 250, 250)
      ctx.drawImage(leftPokeSprite, 0, 165, 250, 250)

      // write skills
      ctx.font = '18px Righteous'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'start'
      if (i % 6 !== 0) {
        ctx.fillText(roundInfo[loserDataName].currentSkillName, rightPokemon === data.winnerPokemon ? 15 : 315, 480)
        ctx.fillText(roundInfo[winnerDataName].currentSkillName, rightPokemon === data.winnerPokemon ? 315 : 15, 480)
      }

      const getSkillTypeFlag = (pokeData: any, who: 'winner' | 'loser') => {
        if (pokeData.currentSkillName === pokeData.skillName) {
          if (who === 'winner') return winnerPokeSkillTypeSprite
          return loserPokeSkillTypeSprite
        }

        if (who === 'winner') return winnerPokeUltimateTypeSprite
        return loserPokeUltimateTypeSprite
      }

      // draw skill types
      if (i % 6 !== 0) {
        ctx.drawImage(
          getSkillTypeFlag(roundInfo[winnerDataName], 'winner'),
          rightPokemon === data.winnerPokemon ? 421 : 131,
          460,
          75,
          25
        )
        ctx.drawImage(
          getSkillTypeFlag(roundInfo[loserDataName], 'loser'),
          rightPokemon === data.winnerPokemon ? 131 : 421,
          460,
          75,
          25
        )
      }

      // write pokenames
      ctx.font = '14px Righteous'
      ctx.fillText(rightPokemon.baseData.name, 350, 135)
      ctx.fillText(leftPokemon.baseData.name, 65, 135)

      // write pokemon levels

      ctx.font = '14px Righteous'
      ctx.textAlign = 'start'
      ctx.fillText(rightPokemon.level.toString(), 470, 135)
      ctx.fillText(leftPokemon.level.toString(), 200, 135)

      ctx.font = '32px Righteous'
      ctx.textAlign = 'center'
      ctx.fillText(`Round ${round}`, 250, 52)

      // write crits
      ctx.font = '32px Righteous'
      ctx.fillStyle = 'yellow'
      ctx.strokeStyle = 'black'
      ctx.textAlign = 'start'

      if (roundInfo[winnerDataName].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
        ctx.fillText(`CRITICAL!`, winnerHpBarXOffset, 180)
        ctx.strokeText(`CRITICAL!`, winnerHpBarXOffset, 180)
      }

      if (roundInfo[loserDataName].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
        ctx.fillText(`CRITICAL!`, loserHpBarXOffset, 180)
        ctx.strokeText(`CRITICAL!`, loserHpBarXOffset, 180)
      }

      ctx.fillStyle = 'blue'

      if (roundInfo[winnerDataName].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
        ctx.fillText(`BLOCK!`, winnerHpBarXOffset, 215)
        ctx.strokeText(`BLOCK!`, winnerHpBarXOffset, 215)
      }

      if (roundInfo[loserDataName].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
        ctx.fillText(`BLOCK!`, loserHpBarXOffset, 215)
        ctx.strokeText(`BLOCK!`, loserHpBarXOffset, 215)
      }

      ctx.fillStyle = 'white'
      ctx.font = '24px Righteous'

      if (
        roundInfo[winnerDataName].hasUltimate &&
        roundInfo[winnerDataName].currentSkillName === roundInfo[winnerDataName].ultimateName &&
        (isDuelInProgress || i < data.roundCount * framesPerRound)
      ) {
        ctx.fillText(roundInfo[winnerDataName].currentSkillName, winnerHpBarXOffset, 235)
        ctx.strokeText(roundInfo[winnerDataName].currentSkillName, winnerHpBarXOffset, 235)
      }

      if (
        roundInfo[loserDataName].hasUltimate &&
        roundInfo[loserDataName].currentSkillName === roundInfo[loserDataName].ultimateName &&
        (isDuelInProgress || i < data.roundCount * framesPerRound)
      ) {
        ctx.fillText(roundInfo[loserDataName].currentSkillName, loserHpBarXOffset, 235)
        ctx.strokeText(roundInfo[loserDataName].currentSkillName, loserHpBarXOffset, 235)
      }

      if (!isDuelInProgress && i > data.roundCount * framesPerRound) {
        ctx.font = '32px Righteous'
        ctx.fillStyle = 'green'
        ctx.strokeStyle = 'black'
        ctx.textAlign = 'center'
        ctx.fillText(`VENCEDOR!`, rightPokemon === data.winnerPokemon ? 365 : 105, 180)
        ctx.strokeText(`VENCEDOR!`, rightPokemon === data.winnerPokemon ? 365 : 105, 180)
      }

      encoder.addFrame(ctx as any)
      if (roundInfo.poke1Data.hp <= 0 || roundInfo.poke2Data.hp <= 0) isDuelInProgress = false
    }

    // Finish encoding the GIF
    encoder.finish()

    resolve(filepath)
  })

  // Delete the file after 30 seconds
  setTimeout(() => {
    fs.unlink(filepath, error => {
      if (error) {
        console.error(`Failed to delete file: ${error}`)
      } else {
        console.log('File deleted successfully.')
      }
    })
  }, 30000)

  return filepath
}
