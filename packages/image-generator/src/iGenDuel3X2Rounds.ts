import { Image } from 'canvas'
import fs from 'fs'
import GIFEncoder from 'gifencoder'
import path from 'path'
import { DuelNxNRoundData } from '../../../common/types/index'
import { createCanvas2d, drawBackground } from './helpers/canvasHelper'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { TDuelRoundData } from './iGenDuel2X1Rounds'

export const iGenDuel3X2Rounds = async (data: TDuelRoundData): Promise<string> => {
  const filepath = await new Promise<string>(resolve => {
    async function processCode() {
      const { leftTeam, rightTeam } = data

      const { backgroundTypeName } =
        data || [rightTeam[0].type1, rightTeam[0].type2 || rightTeam[0].type1][Math.floor(Math.random() * 2)]

      const hudUrl = './src/assets/sprites/UI/hud/duel_3x2_round.png'
      const backgroundUrl = `./src/assets/sprites/UI/hud/duel_bg/${backgroundTypeName}.png`
      // Create a canvas with the defined dimensions
      const canvas = await createCanvas2d(1, false)

      const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

      // Create a new GIFEncoder instance
      const encoder = new GIFEncoder(500, 500)
      encoder.createReadStream().pipe(fs.createWriteStream(filepath))

      // load poke1 sprite
      const leftPokeSprite0 = await loadOrSaveImageFromCache(leftTeam[0].spriteUrl)
      // load poke2 sprite
      const leftPokeSprite1 = await loadOrSaveImageFromCache(leftTeam[1].spriteUrl)
      // load poke3 sprite
      const leftPokeSprite2 = await loadOrSaveImageFromCache(leftTeam[2].spriteUrl)

      // load poke1 sprite
      const rightPokeSprite0 = await loadOrSaveImageFromCache(rightTeam[0].spriteUrl)
      // load poke2 sprite
      const rightPokeSprite1 = await loadOrSaveImageFromCache(rightTeam[1].spriteUrl)

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
      const hud = await loadOrSaveImageFromCache(hudUrl)
      const leftPokeCanvas = await createCanvas2d(1, false, 250)

      // Draw the still part of the animation:

      const drawStillPart = (roundInfo: DuelNxNRoundData) => {
        leftPokeCanvas.clearArea()
        leftPokeCanvas.invertHorizontally()
        canvas.draw({
          height: 500,
          width: 500,
          positionX: 0,
          positionY: 0,
          image: background,
        })
        canvas.draw({
          height: 500,
          width: 500,
          positionX: 0,
          positionY: 0,
          image: hud,
        })

        if (roundInfo.leftTeamData[2].hp > 0)
          leftPokeCanvas.draw({
            height: 251,
            width: 251,
            positionX: -51,
            positionY: 95,
            image: leftPokeSprite2,
          })

        if (roundInfo.leftTeamData[0].hp > 0)
          leftPokeCanvas.draw({
            height: 251,
            width: 251,
            positionX: 65,
            positionY: 150,
            image: leftPokeSprite0,
          })

        if (roundInfo.leftTeamData[1].hp > 0)
          leftPokeCanvas.draw({
            height: 251,
            width: 251,
            positionX: -50,
            positionY: 160,
            image: leftPokeSprite1,
          })

        canvas.draw({
          height: 500,
          width: 250,
          positionX: 0,
          positionY: 0,
          image: leftPokeCanvas.canvas,
        })

        if (roundInfo.rightTeamData[0].hp > 0)
          canvas.draw({
            height: 251,
            width: 251,
            positionX: 340,
            positionY: 150,
            image: rightPokeSprite0,
          })

        if (roundInfo.rightTeamData[1].hp > 0)
          canvas.draw({
            height: 251,
            width: 251,
            positionX: 240,
            positionY: 160,
            image: rightPokeSprite1,
          })

        const nameLevelDefaults: any = {
          fillStyle: 'white',
          font: '14px Righteous',
          textAlign: 'start',
        }

        canvas.write({
          ...nameLevelDefaults,
          positionX: 65,
          positionY: 35,
          text: leftTeam[0].name,
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 200,
          positionY: 35,
          text: leftTeam[0].level.toString(),
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 65,
          positionY: 85,
          text: leftTeam[1].name,
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 200,
          positionY: 85,
          text: leftTeam[1].level.toString(),
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 65,
          positionY: 135,
          text: leftTeam[2].name,
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 200,
          positionY: 135,
          text: leftTeam[2].level.toString(),
        })

        // right team

        canvas.write({
          ...nameLevelDefaults,
          positionX: 325,
          positionY: 85,
          textAlign: 'start',
          text: rightTeam[0].name,
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 495,
          positionY: 85,
          textAlign: 'start',
          text: rightTeam[0].level.toString(),
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 325,
          positionY: 135,
          textAlign: 'start',
          text: rightTeam[1].name,
        })

        canvas.write({
          ...nameLevelDefaults,
          positionX: 495,
          positionY: 135,
          textAlign: 'start',
          text: rightTeam[1].level.toString(),
        })

        // end
      }

      // Configure the GIFEncoder
      encoder.start()
      encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
      encoder.setDelay(200) // Delay between frames in milliseconds
      encoder.setQuality(60) // Image quality (lower is better)

      const framesPerRound = 2
      let round = 1
      let roundInfo = data.duelMap.get(round)

      if (!roundInfo) roundInfo = data.duelMap.get(round - 1)
      if (!roundInfo) throw new Error('no round info in igenduel3x1')

      drawStillPart(roundInfo)
      const buffer = canvas.toBuffer()
      const stillBackground = await loadOrSaveImageFromCache(buffer)

      for (let i = 0; i < data.roundCount * framesPerRound + 12; i++) {
        if (i > round * framesPerRound && round < data.roundCount) {
          round++
          roundInfo = data.duelMap.get(round)
        }
        if (!roundInfo) roundInfo = data.duelMap.get(round - 1)
        if (!roundInfo) continue

        canvas.clearArea()

        drawBackground(canvas, stillBackground)

        const hpDefaults = {
          h: 7,
          fillStyle: `rgb(160,40,40)`,
          x: 55,
        }

        canvas.fillRect({
          ...hpDefaults,
          y: 7,
          w: Math.max(0, (roundInfo.leftTeamData[0].hp / roundInfo.leftTeamData[0].maxHp) * 125),
        })

        canvas.fillRect({
          ...hpDefaults,
          y: 62,
          w: Math.max(0, (roundInfo.leftTeamData[1].hp / roundInfo.leftTeamData[1].maxHp) * 125),
        })

        canvas.fillRect({
          ...hpDefaults,
          y: 107,
          w: Math.max(0, (roundInfo.leftTeamData[2].hp / roundInfo.leftTeamData[2].maxHp) * 125),
        })

        const rightHpDefaults = {
          h: 7,
          fillStyle: `rgb(160,40,40)`,
          x: 380,
        }

        canvas.fillRect({
          ...rightHpDefaults,
          y: 62,
          w: Math.max(0, (roundInfo.rightTeamData[1].hp / roundInfo.rightTeamData[1].maxHp) * 125),
        })

        canvas.fillRect({
          ...rightHpDefaults,
          y: 107,
          w: Math.max(0, (roundInfo.rightTeamData[0].hp / roundInfo.rightTeamData[0].maxHp) * 125),
        })

        // draw mana

        const leftManaDefaults = {
          fillStyle: `rgb(50,121,211)`,
          h: 3,
          x: 5,
        }
        canvas.fillRect({ ...leftManaDefaults, y: 50, w: Math.max(0, (roundInfo.leftTeamData[0].mana / 100) * 175) })
        canvas.fillRect({ ...leftManaDefaults, y: 100, w: Math.max(0, (roundInfo.leftTeamData[1].mana / 100) * 175) })
        canvas.fillRect({ ...leftManaDefaults, y: 145, w: Math.max(0, (roundInfo.leftTeamData[2].mana / 100) * 175) })

        const rightManaDefaults = {
          fillStyle: `rgb(50,121,211)`,
          h: 3,
          x: 315,
        }

        canvas.fillRect({ ...rightManaDefaults, y: 100, w: Math.max(0, (roundInfo.rightTeamData[1].mana / 100) * 175) })
        canvas.fillRect({ ...rightManaDefaults, y: 145, w: Math.max(0, (roundInfo.rightTeamData[0].mana / 100) * 175) })

        const leftTeamSkillNameDefaults: any = {
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 15,
        }
        canvas.write({
          ...leftTeamSkillNameDefaults,
          positionY: 375,
          text: roundInfo.leftTeamData[0].currentSkillName ?? '',
        })
        canvas.write({
          ...leftTeamSkillNameDefaults,
          positionY: 425,
          text: roundInfo.leftTeamData[1].currentSkillName ?? '',
        })
        canvas.write({
          ...leftTeamSkillNameDefaults,
          positionY: 475,
          text: roundInfo.leftTeamData[2].currentSkillName ?? '',
        })

        const rightTeamSkillNameDefaults: any = {
          fillStyle: 'white',
          font: '15px Righteous',
          textAlign: 'start',
          positionX: 315,
        }

        canvas.write({
          ...rightTeamSkillNameDefaults,
          positionY: 425,
          text: roundInfo.rightTeamData[1].currentSkillName ?? '',
        })
        canvas.write({
          ...rightTeamSkillNameDefaults,
          positionY: 475,
          text: roundInfo.rightTeamData[0].currentSkillName ?? '',
        })

        // draw skill types
        if (i % 6 !== 0) {
          for (let i = 0; i < roundInfo.leftTeamData.length; i++) {
            const skillFlag = skillFlagImagesMap.get(roundInfo.leftTeamData[i].currentSkillType ?? '')
            if (skillFlag) {
              canvas.draw({
                positionX: 131,
                positionY: 362 + i * 50,
                height: 25,
                width: 72,
                image: skillFlag,
              })
            }
          }
          for (let i = 0; i < roundInfo.rightTeamData.length; i++) {
            const skillFlag = skillFlagImagesMap.get(roundInfo.rightTeamData[i].currentSkillType ?? '')
            if (skillFlag) {
              canvas.draw({
                positionX: 421,
                positionY: 412 + i * 50,
                height: 25,
                width: 72,
                image: skillFlag,
              })
            }
          }
        }

        /// write crits

        if (
          roundInfo.leftTeamData.map(left => left.crit).some(crit => crit === true) &&
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

        if (
          roundInfo.rightTeamData.map(left => left.crit).some(crit => crit === true) &&
          i < data.roundCount * framesPerRound
        ) {
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
          roundInfo.leftTeamData.map(left => left.block).some(block => block === true) &&
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

        if (
          roundInfo.rightTeamData.map(left => left.block).some(block => block === true) &&
          i < data.roundCount * framesPerRound
        ) {
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
