import { BasePokemon, Pokemon } from '@prisma/client'
import { createCanvas, loadImage, registerFont } from 'canvas'
import fs from 'fs'
import GIFEncoder from 'gifencoder'
import path from 'path'
import { removeFileFromDisk } from 'server/helpers/fileHelper'

type duelPokemon = Pokemon & {
  baseData: BasePokemon
  name: string
  skillName: string
  skillType: string
  ultimateType: string
}

type TDuelRoundData = {
  winnerTeam: duelPokemon[]
  loserTeam: duelPokemon[]
  roundCount: number
  duelMap: Map<number, any>
  winnerDataNames: string[]
  loserDataNames: string[]
}

export const iGenDuelX2Rounds = async (data: TDuelRoundData): Promise<string> => {
  const filepath = await new Promise<string>(resolve => {
    async function processCode() {
      const { winnerDataNames, loserDataNames } = data
      const random = Math.random()
      const rightPokemons = random >= 0.5 ? data.winnerTeam : data.loserTeam
      const leftPokemons = random >= 0.5 ? data.loserTeam : data.winnerTeam

      // Define the dimensions of the canvas and the background
      const canvasWidth = 500
      const canvasHeight = 500
      const backgroundUrl = './src/assets/sprites/UI/hud/duel_x2_round.png'

      // Load the font file and register it with the canvas
      registerFont('./src/assets/font/JosefinSans-Bold.ttf', { family: 'Pokemon' })

      registerFont('./src/assets/font/Righteous.ttf', { family: 'Righteous' })

      // Create a canvas with the defined dimensions
      const canvas = createCanvas(canvasWidth, canvasHeight)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false

      const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

      // Create a new GIFEncoder instance
      const encoder = new GIFEncoder(500, 500)
      encoder.createReadStream().pipe(fs.createWriteStream(filepath))

      // draw poke1 sprite
      const rightPokeSprite0 = await loadImage(rightPokemons[0].spriteUrl)
      // draw poke2 sprite
      const rightPokeSprite1 = await loadImage(rightPokemons[1].spriteUrl)

      // draw poke3 sprite
      const leftPokeSprite0 = await loadImage(leftPokemons[0].spriteUrl)
      // draw poke4 sprite
      const leftPokeSprite1 = await loadImage(leftPokemons[1].spriteUrl)

      const winnerPoke0SkillTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.winnerTeam[0].skillType + '.png'
      )
      const loserPoke0SkillTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.loserTeam[0].skillType + '.png'
      )
      const winnerPoke0UltimateTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.winnerTeam[0].ultimateType + '.png'
      )
      const loserPoke0UltimateTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.loserTeam[0].ultimateType + '.png'
      )
      const winnerPoke1SkillTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.winnerTeam[1].skillType + '.png'
      )
      const loserPoke1SkillTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.loserTeam[1].skillType + '.png'
      )
      const winnerPoke1UltimateTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.winnerTeam[1].ultimateType + '.png'
      )
      const loserPoke1UltimateTypeSprite = await loadImage(
        './src/assets/sprites/UI/types/' + data.loserTeam[1].ultimateType + '.png'
      )

      // Load the background image
      const background = await loadImage(backgroundUrl)

      /*     // draw talents

    const rightPokemon0Talents = [
      talentIdMap.get(rightPokemons[0].talentId1),
      talentIdMap.get(rightPokemons[0].talentId2),
      talentIdMap.get(rightPokemons[0].talentId3),
      talentIdMap.get(rightPokemons[0].talentId4),
      talentIdMap.get(rightPokemons[0].talentId5),
      talentIdMap.get(rightPokemons[0].talentId6),
      talentIdMap.get(rightPokemons[0].talentId7),
      talentIdMap.get(rightPokemons[0].talentId8),
      talentIdMap.get(rightPokemons[0].talentId9),
    ]

    const rightPokemon1Talents = [
      talentIdMap.get(rightPokemons[1].talentId1),
      talentIdMap.get(rightPokemons[1].talentId2),
      talentIdMap.get(rightPokemons[1].talentId3),
      talentIdMap.get(rightPokemons[1].talentId4),
      talentIdMap.get(rightPokemons[1].talentId5),
      talentIdMap.get(rightPokemons[1].talentId6),
      talentIdMap.get(rightPokemons[1].talentId7),
      talentIdMap.get(rightPokemons[1].talentId8),
      talentIdMap.get(rightPokemons[1].talentId9),
    ]

    const leftPokemon0Talents = [
      talentIdMap.get(leftPokemons[0].talentId1),
      talentIdMap.get(leftPokemons[0].talentId2),
      talentIdMap.get(leftPokemons[0].talentId3),
      talentIdMap.get(leftPokemons[0].talentId4),
      talentIdMap.get(leftPokemons[0].talentId5),
      talentIdMap.get(leftPokemons[0].talentId6),
      talentIdMap.get(leftPokemons[0].talentId7),
      talentIdMap.get(leftPokemons[0].talentId8),
      talentIdMap.get(leftPokemons[0].talentId9),
    ]

    const leftPokemon1Talents = [
      talentIdMap.get(leftPokemons[1].talentId1),
      talentIdMap.get(leftPokemons[1].talentId2),
      talentIdMap.get(leftPokemons[1].talentId3),
      talentIdMap.get(leftPokemons[1].talentId4),
      talentIdMap.get(leftPokemons[1].talentId5),
      talentIdMap.get(leftPokemons[1].talentId6),
      talentIdMap.get(leftPokemons[1].talentId7),
      talentIdMap.get(leftPokemons[1].talentId8),
      talentIdMap.get(leftPokemons[1].talentId9),
    ]

    const talentSprites: any = {}
    for (const talent of leftPokemon0Talents) {
      if (talent && !talentSprites[talent]) {
        talentSprites[talent] = await loadImage('./src/assets/sprites/UI/types/circle/' + talent + '.png')
      }
    }
    for (const talent of leftPokemon1Talents) {
      if (talent && !talentSprites[talent]) {
        talentSprites[talent] = await loadImage('./src/assets/sprites/UI/types/circle/' + talent + '.png')
      }
    }
    for (const talent of rightPokemon0Talents) {
      if (talent && !talentSprites[talent]) {
        talentSprites[talent] = await loadImage('./src/assets/sprites/UI/types/circle/' + talent + '.png')
      }
    }
    for (const talent of rightPokemon1Talents) {
      if (talent && !talentSprites[talent]) {
        talentSprites[talent] = await loadImage('./src/assets/sprites/UI/types/circle/' + talent + '.png')
      }
    } */

      /*    const drawTalents = async (talents: (string | undefined)[], xOffset: number, yOffset: number) => {
      if (!talents) return
      for (let j = 0; j < 9; j++) {
        const x = xOffset + j * 22
        const y = yOffset

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

        ctx.drawImage(talentSprites[talent], x, y, 21, 21)
      }
    } */

      // Draw the still part of the animation:

      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

      ctx.drawImage(rightPokeSprite0, 240, 165, 250, 250)
      ctx.drawImage(leftPokeSprite0, -50, 165, 250, 250)

      ctx.drawImage(rightPokeSprite1, 315, 165, 250, 250)
      ctx.drawImage(leftPokeSprite1, 25, 165, 250, 250)

      ctx.fillStyle = 'white'

      // write pokenames
      ctx.font = '14px Righteous'
      ctx.fillText(rightPokemons[0].name, 350, 93)
      ctx.fillText(leftPokemons[0].name, 65, 93)

      ctx.fillText(rightPokemons[1].name, 350, 150)
      ctx.fillText(leftPokemons[1].name, 65, 150)

      // write pokemon levels

      ctx.font = '14px Righteous'
      ctx.textAlign = 'start'
      ctx.fillText(rightPokemons[0].level.toString(), 470, 93)
      ctx.fillText(leftPokemons[0].level.toString(), 200, 93)
      ctx.fillText(rightPokemons[1].level.toString(), 470, 150)
      ctx.fillText(leftPokemons[1].level.toString(), 200, 150)

      /*   await drawTalents(rightPokemon0Talents, 305, 400)
    await drawTalents(leftPokemon0Talents, 5, 400)
    await drawTalents(rightPokemon1Talents, 305, 400)
    await drawTalents(leftPokemon1Talents, 5, 400) */

      /// ////////////////////////////////////////////////////////////

      // Convert the canvas to a buffer
      const canvasBuffer = canvas.toBuffer('image/png') // Specify the desired image format ('image/png' in this example)

      const duelStillImage = await loadImage(canvasBuffer)

      // Configure the GIFEncoder
      encoder.start()
      encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
      encoder.setDelay(400) // Delay between frames in milliseconds
      encoder.setQuality(60) // Image quality (lower is better)

      const framesPerRound = 2
      let round = 1
      let roundInfo = data.duelMap.get(round)
      let isDuelInProgress = true

      const winnerHpBarXOffset = random >= 0.5 ? 365 : 55
      const loserHpBarXOffset = random >= 0.5 ? 55 : 365

      for (let i = 0; i < data.roundCount * framesPerRound + 6; i++) {
        if (i > round * framesPerRound && isDuelInProgress) {
          round++
          roundInfo = data.duelMap.get(round)
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(duelStillImage, 0, 0, canvasWidth, canvasHeight)

        ctx.fillStyle = `rgb(160,40,40)`
        ctx.fillRect(
          winnerHpBarXOffset,
          65,
          Math.max(0, (roundInfo[winnerDataNames[0]].hp / roundInfo[winnerDataNames[0]].maxHp) * 125),
          7
        )

        ctx.fillRect(
          loserHpBarXOffset,
          65,
          Math.max(0, (roundInfo[loserDataNames[0]].hp / roundInfo[loserDataNames[0]].maxHp) * 125),
          7
        )

        ctx.fillStyle = `rgb(160,40,40)`
        ctx.fillRect(
          winnerHpBarXOffset,
          120,
          Math.max(0, (roundInfo[winnerDataNames[1]].hp / roundInfo[winnerDataNames[1]].maxHp) * 125),
          7
        )

        ctx.fillRect(
          loserHpBarXOffset,
          120,
          Math.max(0, (roundInfo[loserDataNames[1]].hp / roundInfo[loserDataNames[1]].maxHp) * 125),
          7
        )

        // draw mana

        ctx.fillStyle = `rgb(50,121,211)`
        ctx.fillRect(loserHpBarXOffset - 55, 103, Math.max(0, (roundInfo[loserDataNames[0]].mana / 103) * 175), 3)
        ctx.fillRect(winnerHpBarXOffset - 55, 103, Math.max(0, (roundInfo[winnerDataNames[0]].mana / 100) * 175), 3)
        ctx.fillRect(loserHpBarXOffset - 55, 158, Math.max(0, (roundInfo[loserDataNames[1]].mana / 100) * 175), 3)
        ctx.fillRect(winnerHpBarXOffset - 55, 158, Math.max(0, (roundInfo[winnerDataNames[1]].mana / 100) * 175), 3)

        // write skills
        ctx.font = '18px Righteous'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'start'
        if (i % 6 !== 0) {
          ctx.fillText(
            roundInfo[loserDataNames[0]].currentSkillName,
            rightPokemons[0] === data.winnerTeam[0] ? 15 : 315,
            411
          )
          ctx.fillText(
            roundInfo[winnerDataNames[0]].currentSkillName,
            rightPokemons[0] === data.winnerTeam[0] ? 315 : 15,
            411
          )
          ctx.fillText(
            roundInfo[loserDataNames[1]].currentSkillName,
            rightPokemons[1] === data.winnerTeam[1] ? 15 : 315,
            477
          )
          ctx.fillText(
            roundInfo[winnerDataNames[1]].currentSkillName,
            rightPokemons[1] === data.winnerTeam[1] ? 315 : 15,
            477
          )
        }

        const winnerPokeSkillTypeSprites = [winnerPoke0SkillTypeSprite, winnerPoke1SkillTypeSprite]
        const loserPokeSkillTypeSprites = [loserPoke0SkillTypeSprite, loserPoke1SkillTypeSprite]

        const winnerPokeUltimateTypeSprites = [winnerPoke0UltimateTypeSprite, winnerPoke1UltimateTypeSprite]
        const loserPokeUltimateTypeSprites = [loserPoke0UltimateTypeSprite, loserPoke1UltimateTypeSprite]

        const getSkillTypeFlag = (pokeData: any, who: 'winner' | 'loser', index: 0 | 1) => {
          if (pokeData.currentSkillName === pokeData.skillName) {
            if (who === 'winner') return winnerPokeSkillTypeSprites[index]
            return loserPokeSkillTypeSprites[index]
          }

          if (who === 'winner') return winnerPokeUltimateTypeSprites[index]
          return loserPokeUltimateTypeSprites[index]
        }

        // draw skill types
        if (i % 6 !== 0) {
          ctx.drawImage(
            getSkillTypeFlag(roundInfo[winnerDataNames[0]], 'winner', 0),
            rightPokemons[0] === data.winnerTeam[0] ? 421 : 131,
            393,
            75,
            25
          )
          ctx.drawImage(
            getSkillTypeFlag(roundInfo[loserDataNames[0]], 'loser', 0),
            rightPokemons[0] === data.winnerTeam[0] ? 131 : 421,
            393,
            75,
            25
          )
          ctx.drawImage(
            getSkillTypeFlag(roundInfo[winnerDataNames[0]], 'winner', 1),
            rightPokemons[0] === data.winnerTeam[0] ? 421 : 131,
            451,
            75,
            25
          )
          ctx.drawImage(
            getSkillTypeFlag(roundInfo[loserDataNames[0]], 'loser', 1),
            rightPokemons[0] === data.winnerTeam[0] ? 131 : 421,
            451,
            75,
            25
          )
        }

        ctx.font = '32px Righteous'
        ctx.textAlign = 'center'
        ctx.fillText(`Round ${round}`, 250, 31)

        // write crits
        ctx.font = '32px Righteous'
        ctx.fillStyle = 'yellow'
        ctx.strokeStyle = 'black'
        ctx.textAlign = 'start'

        if (roundInfo[winnerDataNames[0]].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`CRITICAL!`, winnerHpBarXOffset, 180)
          ctx.strokeText(`CRITICAL!`, winnerHpBarXOffset, 180)
        }

        if (roundInfo[loserDataNames[0]].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`CRITICAL!`, loserHpBarXOffset, 180)
          ctx.strokeText(`CRITICAL!`, loserHpBarXOffset, 180)
        }

        if (roundInfo[winnerDataNames[1]].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`CRITICAL!`, winnerHpBarXOffset, 195)
          ctx.strokeText(`CRITICAL!`, winnerHpBarXOffset, 195)
        }

        if (roundInfo[loserDataNames[1]].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`CRITICAL!`, loserHpBarXOffset, 195)
          ctx.strokeText(`CRITICAL!`, loserHpBarXOffset, 195)
        }

        ctx.fillStyle = 'blue'

        if (roundInfo[winnerDataNames[0]].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`BLOCK!`, winnerHpBarXOffset, 215)
          ctx.strokeText(`BLOCK!`, winnerHpBarXOffset, 215)
        }

        if (roundInfo[loserDataNames[0]].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`BLOCK!`, loserHpBarXOffset, 215)
          ctx.strokeText(`BLOCK!`, loserHpBarXOffset, 215)
        }
        if (roundInfo[winnerDataNames[1]].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`BLOCK!`, winnerHpBarXOffset, 231)
          ctx.strokeText(`BLOCK!`, winnerHpBarXOffset, 231)
        }

        if (roundInfo[loserDataNames[1]].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
          ctx.fillText(`BLOCK!`, loserHpBarXOffset, 231)
          ctx.strokeText(`BLOCK!`, loserHpBarXOffset, 231)
        }

        if (!isDuelInProgress && i > data.roundCount * framesPerRound) {
          ctx.font = '32px Righteous'
          ctx.fillStyle = 'green'
          ctx.strokeStyle = 'black'
          ctx.textAlign = 'center'
          ctx.fillText(`VENCEDOR!`, rightPokemons === data.winnerTeam ? 365 : 105, 180)
          ctx.strokeText(`VENCEDOR!`, rightPokemons === data.winnerTeam ? 365 : 105, 180)
        }

        encoder.addFrame(ctx as any)
        if (
          (roundInfo.poke1Data.hp <= 0 && roundInfo.poke2Data.hp <= 0) ||
          (roundInfo.poke3Data.hp <= 0 && roundInfo.poke4Data.hp <= 0)
        )
          isDuelInProgress = false
      }

      // Finish encoding the GIF
      encoder.finish()
    }

    processCode()
    resolve(filepath)
  })

  removeFileFromDisk(filepath, 60000)

  Promise.all(filepath)

  return filepath
}
