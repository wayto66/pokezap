import { Image, loadImage } from 'canvas'
import fs from 'fs'
import GIFEncoder from 'gifencoder'
import path from 'path'
import { removeFileFromDisk } from 'server/helpers/fileHelper'
import { createCanvas2d } from '../../../server/helpers/canvasHelper'
import { BossInvasionRoundData, RoundPokemonData } from '../duel/duelNX1'

export type TDuelRoundData = {
  alliesTeam: RoundPokemonData[]
  boss: RoundPokemonData
  roundCount: number
  duelMap: Map<number, BossInvasionRoundData>
}

export const iGenDuel2X1Rounds = async (data: TDuelRoundData): Promise<string> => {
  const filepath = await new Promise<string>(resolve => {
    async function processCode() {
      const boss = data.boss
      const allyTeam = data.alliesTeam

      // Define the dimensions of the canvas and the background
      const backgroundUrl = './src/assets/sprites/UI/hud/duel_2x1_round.png'

      // Create a canvas with the defined dimensions
      const canvas = await createCanvas2d(1, false)

      const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

      // Create a new GIFEncoder instance
      const encoder = new GIFEncoder(500, 500)
      encoder.createReadStream().pipe(fs.createWriteStream(filepath))

      // load poke1 sprite
      const allyPokeSprite0 = await loadImage(allyTeam[0].spriteUrl)
      // load poke2 sprite
      const allyPokeSprite1 = await loadImage(allyTeam[1].spriteUrl)

      // load boss sprite
      const bossSprite = await loadImage(boss.spriteUrl)

      type TFlagSpriteObject = {
        skillFlag: Image
        ultimateFlag: Image
      }

      const skillFlagMap = new Map<number, TFlagSpriteObject>([])

      for (const ally of allyTeam) {
        skillFlagMap.set(ally.id, {
          skillFlag: await loadImage('./src/assets/sprites/UI/types/' + ally.skillType + '.png'),
          ultimateFlag: await loadImage('./src/assets/sprites/UI/types/' + ally.ultimateType + '.png'),
        })
      }

      const bossSkillTypeFlag = await loadImage('./src/assets/sprites/UI/types/' + boss.skillType + '.png')

      // Load the background image
      const background = await loadImage(backgroundUrl)

      // Draw the still part of the animation:

      const drawStillPart = (roundInfo: BossInvasionRoundData) => {
        canvas.draw({
          height: 500,
          width: 500,
          positionX: 0,
          positionY: 0,
          image: background,
        })

        if (roundInfo.alliesTeamData[0].hp > 0)
          canvas.draw({
            height: 251,
            width: 251,
            positionX: 51,
            positionY: 145,
            image: allyPokeSprite0,
          })

        if (roundInfo.alliesTeamData[1].hp > 0)
          canvas.draw({
            height: 251,
            width: 251,
            positionX: -50,
            positionY: 185,
            image: allyPokeSprite1,
          })

        canvas.draw({
          height: 251,
          width: 251,
          positionX: 240,
          positionY: 145,
          image: bossSprite,
        })

        canvas.write({
          fillStyle: 'white',
          font: '14px Righteous',
          positionX: 65,
          positionY: 85,
          textAlign: 'start',
          text: allyTeam[0].name,
        })

        canvas.write({
          fillStyle: 'white',
          font: '14px Righteous',
          positionX: 200,
          positionY: 85,
          textAlign: 'start',
          text: allyTeam[0].level.toString(),
        })

        canvas.write({
          fillStyle: 'white',
          font: '14px Righteous',
          positionX: 65,
          positionY: 135,
          textAlign: 'start',
          text: allyTeam[1].name,
        })

        canvas.write({
          fillStyle: 'white',
          font: '14px Righteous',
          positionX: 200,
          positionY: 135,
          textAlign: 'start',
          text: allyTeam[1].level.toString(),
        })

        canvas.write({
          fillStyle: 'white',
          font: '14px Righteous',
          positionX: 325,
          positionY: 135,
          textAlign: 'start',
          text: boss.name,
        })

        canvas.write({
          fillStyle: 'white',
          font: '14px Righteous',
          positionX: 495,
          positionY: 135,
          textAlign: 'end',
          text: boss.level.toString(),
        })
      }

      // Configure the GIFEncoder
      encoder.start()
      encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
      encoder.setDelay(200) // Delay between frames in milliseconds
      encoder.setQuality(60) // Image quality (lower is better)

      const framesPerRound = 2
      let round = 2
      let roundInfo = data.duelMap.get(round)
      let isDuelInProgress = true

      let winner: 'allies' | 'boss' | undefined

      for (let i = 0; i < data.roundCount * framesPerRound + 12; i++) {
        if (i > round * framesPerRound && isDuelInProgress) {
          round++
          roundInfo = data.duelMap.get(round)
        }
        if (!roundInfo) continue

        canvas.clearArea()

        drawStillPart(roundInfo)

        canvas.fillRect({
          fillStyle: `rgb(160,40,40)`,
          x: 55,
          y: 57,
          w: Math.max(0, (roundInfo.alliesTeamData[0].hp / roundInfo.alliesTeamData[0].maxHp) * 125),
          h: 7,
        })

        canvas.fillRect({
          fillStyle: `rgb(160,40,40)`,
          x: 55,
          y: 110,
          w: Math.max(0, (roundInfo.alliesTeamData[1].hp / roundInfo.alliesTeamData[1].maxHp) * 125),
          h: 7,
        })

        canvas.fillRect({
          fillStyle: `rgb(160,40,40)`,
          x: 365,
          y: 108,
          w: Math.max(0, (roundInfo.bossData.hp / roundInfo.bossData.maxHp) * 125),
          h: 7,
        })

        // draw mana
        canvas.fillRect({
          fillStyle: `rgb(50,121,211)`,
          x: 5,
          y: 103,
          w: Math.max(0, (roundInfo.alliesTeamData[0].mana / 100) * 175),
          h: 3,
        })

        canvas.fillRect({
          fillStyle: `rgb(50,121,211)`,
          x: 315,
          y: 103,
          w: Math.max(0, (roundInfo.bossData.mana / 100) * 175),
          h: 3,
        })

        canvas.write({
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 15,
          positionY: 405,
          text: roundInfo.alliesTeamData[0].currentSkillName,
        })

        canvas.write({
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 15,
          positionY: 455,
          text: roundInfo.alliesTeamData[1].currentSkillName,
        })

        canvas.write({
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 315,
          positionY: 425,
          text: roundInfo.bossData.currentSkillName,
        })
        // draw skill types
        if (i % 6 !== 0) {
          canvas.draw({
            positionX: 421,
            positionY: 405,
            height: 25,
            width: 72,
            image: bossSkillTypeFlag,
          })

          for (let i = 0; i < roundInfo.alliesTeamData.length; i++) {
            const skillFlags = skillFlagMap.get(roundInfo.alliesTeamData[i].id)
            const skillFlag =
              roundInfo.alliesTeamData[0].currentSkillName === roundInfo.alliesTeamData[i].skillName
                ? skillFlags?.skillFlag
                : skillFlags?.ultimateFlag

            if (skillFlag) {
              canvas.draw({
                positionX: 131,
                positionY: 390 + i * 50,
                height: 25,
                width: 72,
                image: skillFlag,
              })
            }
          }
        }

        canvas.write({
          positionX: 345,
          positionY: 51,
          textAlign: 'center',
          font: '32px Righteous',
          text: `Round ${round}`,
          fillStyle: 'white',
        })

        /// write crits

        if (
          roundInfo.alliesTeamData.map(ally => ally.crit).some(crit => crit === true) &&
          i < data.roundCount * framesPerRound
        ) {
          canvas.write({
            positionX: 55,
            positionY: 180,
            textAlign: 'center',
            font: '25px Righteous',
            text: `CRITICAL!`,
            fillStyle: 'yellow',
            strokeStyle: 'black',
            strokeText: true,
          })
        }

        if (roundInfo.bossData.crit && i < data.roundCount * framesPerRound) {
          canvas.write({
            positionX: 365,
            positionY: 180,
            textAlign: 'center',
            font: '25px Righteous',
            text: `CRITICAL!`,
            fillStyle: 'yellow',
            strokeStyle: 'black',
            strokeText: true,
          })
        }

        /// write blocks

        if (
          roundInfo.alliesTeamData.map(ally => ally.block).some(block => block === true) &&
          i < data.roundCount * framesPerRound
        ) {
          canvas.write({
            positionX: 55,
            positionY: 215,
            textAlign: 'center',
            font: '25px Righteous',
            text: `BLOCK!`,
            fillStyle: 'blue',
            strokeStyle: 'black',
            strokeText: true,
          })
        }

        if (roundInfo.bossData.block && i < data.roundCount * framesPerRound) {
          canvas.write({
            positionX: 365,
            positionY: 215,
            textAlign: 'center',
            font: '25px Righteous',
            text: `BLOCK!`,
            fillStyle: 'blue',
            strokeStyle: 'black',
            strokeText: true,
          })
        }

        if (!isDuelInProgress && i > data.roundCount * framesPerRound) {
          canvas.write({
            positionX: winner === 'boss' ? 365 : 105,
            positionY: 180,
            textAlign: 'center',
            font: '32px Righteous',
            text: `VENCEDOR!`,
            fillStyle: 'green',
            strokeStyle: 'black',
            strokeText: true,
          })
        }

        if (roundInfo.alliesTeamData.map(ally => ally.hp).every(hp => hp <= 0) && round >= data.roundCount) {
          isDuelInProgress = false
          winner = 'boss'
        }
        if (roundInfo.bossData.hp <= 0 && round >= data.roundCount) {
          isDuelInProgress = false
          winner = 'allies'
        }

        canvas.addFrameToEncoder(encoder)
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
