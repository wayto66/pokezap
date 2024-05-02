import { Image } from 'canvas'
import fs from 'fs'
import GIFEncoder from 'gifencoder'
import path from 'path'
import { DuelNxNRoundData, RoundPokemonData } from '../../../common/types'
import { createCanvas2d } from './helpers/canvasHelper'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'

export type TDuelRoundData = {
  leftTeam: RoundPokemonData[]
  rightTeam: RoundPokemonData[]
  roundCount: number
  duelMap: Map<number, DuelNxNRoundData>
  winnerSide: 'right' | 'left'
  backgroundTypeName?: string
  staticImage?: boolean
}

export type TFlagSpriteObject = {
  skillFlag: Image
  ultimateFlag: Image
}

export const iGenDuel2X1Rounds = async (data: TDuelRoundData): Promise<string> => {
  const filepath = await new Promise<string>(resolve => {
    async function processCode() {
      const boss = data.rightTeam[0]
      const allyTeam = data.leftTeam

      // Define the dimensions of the canvas and the background
      const backgroundUrl = './src/assets/sprites/UI/hud/duel_2x1_round.png'

      // Create a canvas with the defined dimensions
      const canvas = await createCanvas2d(1, false)

      const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

      // Create a new GIFEncoder instance
      const encoder = new GIFEncoder(500, 500)
      encoder.createReadStream().pipe(fs.createWriteStream(filepath))

      // load poke1 sprite
      const allyPokeSprite0 = await loadOrSaveImageFromCache(allyTeam[0].spriteUrl)
      // load poke2 sprite
      const allyPokeSprite1 = await loadOrSaveImageFromCache(allyTeam[1].spriteUrl)

      // load boss sprite
      const bossSprite = await loadOrSaveImageFromCache(boss.spriteUrl)

      const skillFlagImagesMap = new Map<string, Image>([])

      for (const poke of [data.leftTeam, data.rightTeam].flat()) {
        if (!poke.skillMap) continue
        const skillMap = [
          ...poke.skillMap.supportSkills,
          ...poke.skillMap.tankerSkills,
          ...Array.from(poke.skillMap.damageSkills.keys()),
        ]
        console.log(skillMap.map(s => s.name))
        for (const skill of skillMap) {
          if (!skillFlagImagesMap.get(skill.typeName)) {
            skillFlagImagesMap.set(
              skill.typeName,
              await loadOrSaveImageFromCache('./src/assets/sprites/UI/types/' + skill.typeName + '.png')
            )
          }
        }
      }

      // Load the background image
      const background = await loadOrSaveImageFromCache(backgroundUrl)

      // Draw the still part of the animation:

      const drawStillPart = (roundInfo: DuelNxNRoundData) => {
        canvas.draw({
          height: 500,
          width: 500,
          positionX: 0,
          positionY: 0,
          image: background,
        })

        if (roundInfo.leftTeamData[0].hp > 0)
          canvas.draw({
            height: 251,
            width: 251,
            positionX: 51,
            positionY: 145,
            image: allyPokeSprite0,
          })

        if (roundInfo.leftTeamData[1].hp > 0)
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
      let round = 1
      let roundInfo = data.duelMap.get(round)

      for (let i = 0; i < data.roundCount * framesPerRound + 12; i++) {
        if (i > round * framesPerRound && round < data.roundCount) {
          round++
          roundInfo = data.duelMap.get(round)
        }
        if (!roundInfo) roundInfo = data.duelMap.get(round - 1)
        if (!roundInfo) continue

        canvas.clearArea()

        drawStillPart(roundInfo)

        canvas.fillRect({
          fillStyle: `rgb(160,40,40)`,
          x: 55,
          y: 57,
          w: Math.max(0, (roundInfo.leftTeamData[0].hp / roundInfo.leftTeamData[0].maxHp) * 125),
          h: 7,
        })

        canvas.fillRect({
          fillStyle: `rgb(160,40,40)`,
          x: 55,
          y: 110,
          w: Math.max(0, (roundInfo.leftTeamData[1].hp / roundInfo.leftTeamData[1].maxHp) * 125),
          h: 7,
        })

        canvas.fillRect({
          fillStyle: `rgb(160,40,40)`,
          x: 365,
          y: 108,
          w: Math.max(0, (roundInfo.rightTeamData[0].hp / roundInfo.rightTeamData[0].maxHp) * 125),
          h: 7,
        })

        // draw mana
        canvas.fillRect({
          fillStyle: `rgb(50,121,211)`,
          x: 5,
          y: 103,
          w: Math.max(0, (roundInfo.leftTeamData[0].mana / 100) * 175),
          h: 3,
        })

        canvas.fillRect({
          fillStyle: `rgb(50,121,211)`,
          x: 315,
          y: 103,
          w: Math.max(0, (roundInfo.rightTeamData[0].mana / 100) * 175),
          h: 3,
        })

        canvas.write({
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 15,
          positionY: 405,
          text: roundInfo.leftTeamData[0].currentSkillName ?? '',
        })

        canvas.write({
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 15,
          positionY: 455,
          text: roundInfo.leftTeamData[1].currentSkillName ?? '',
        })

        canvas.write({
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 315,
          positionY: 425,
          text: roundInfo.rightTeamData[0].currentSkillName ?? '',
        })
        // draw skill types
        if (i % 6 !== 0) {
          const bossSkillFlag = skillFlagImagesMap.get(roundInfo.rightTeamData[0].currentSkillType ?? '')
          if (bossSkillFlag)
            canvas.draw({
              positionX: 421,
              positionY: 405,
              height: 25,
              width: 72,
              image: bossSkillFlag,
            })

          for (let i = 0; i < roundInfo.leftTeamData.length; i++) {
            const skillFlag = skillFlagImagesMap.get(roundInfo.leftTeamData[i].currentSkillType ?? '')
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
          roundInfo.leftTeamData.map(ally => ally.crit).some(crit => crit === true) &&
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

        if (roundInfo.rightTeamData[0].crit && i < data.roundCount * framesPerRound) {
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
          roundInfo.leftTeamData.map(ally => ally.block).some(block => block === true) &&
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

        if (roundInfo.rightTeamData[0].block && i < data.roundCount * framesPerRound) {
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

        if (i > data.roundCount * framesPerRound) {
          canvas.write({
            positionX: data.winnerSide === 'right' ? 365 : 105,
            positionY: 180,
            textAlign: 'center',
            font: '32px Righteous',
            text: `VENCEDOR!`,
            fillStyle: 'green',
            strokeStyle: 'black',
            strokeText: true,
          })
        }

        canvas.addFrameToEncoder(encoder)
      }

      // Finish encoding the GIF
      encoder.finish()

      return filepath
    }
    resolve(processCode())
  })

  removeFileFromDisk(filepath, 60000)

  Promise.all(filepath)

  return filepath
}
