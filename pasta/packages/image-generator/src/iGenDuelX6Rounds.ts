import { Image, createCanvas } from 'canvas'
import fs from 'fs'
import GIFEncoder from 'gifencoder'
import path from 'path'
import { removeFileFromDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { TDuelRoundData } from './iGenDuel2X1Rounds'

export const iGenDuelX6Rounds = async (data: TDuelRoundData): Promise<string> => {
  const filepath = await new Promise<string>(resolve => {
    async function processCode() {
      const { leftTeam, rightTeam } = data

      // Define the dimensions of the canvas and the background
      const canvasWidth = 500
      const canvasHeight = 500
      const backgroundUrl = './src/assets/sprites/UI/hud/duel_bg/fighting.png'
      const hudUrl = './src/assets/sprites/UI/hud/duel_x2_round.png'

      // Create a canvas with the defined dimensions
      const canvas = createCanvas(canvasWidth, canvasHeight)
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = false

      const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

      // Create a new GIFEncoder instance
      const encoder = new GIFEncoder(500, 500)
      encoder.createReadStream().pipe(fs.createWriteStream(filepath))

      const rightTeamSprites = new Map<number, Image>([])
      const leftTeamSprites = new Map<number, Image>([])

      for (let i = 0; i < 6; i++) {
        rightTeamSprites.set(rightTeam[i].id, await loadOrSaveImageFromCache(rightTeam[i].spriteUrl))
        leftTeamSprites.set(leftTeam[i].id, await loadOrSaveImageFromCache(leftTeam[i].spriteUrl))
      }

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

      // Draw the still part of the animation:

      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)
      ctx.drawImage(hud, 0, 0, canvasWidth, canvasHeight)

      // Convert the canvas to a buffer
      const canvasBuffer = canvas.toBuffer('image/png') // Specify the desired image format ('image/png' in this example)

      const duelStillImage = await loadOrSaveImageFromCache(canvasBuffer)

      // Configure the GIFEncoder
      encoder.start()
      encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
      encoder.setDelay(400) // Delay between frames in milliseconds
      encoder.setQuality(60) // Image quality (lower is better)

      const framesPerRound = 2
      let round = 1
      let roundInfo = data.duelMap.get(round)

      for (let i = 0; i < data.roundCount * framesPerRound + 6; i++) {
        if (i > round * framesPerRound && round < data.roundCount) {
          round++
          roundInfo = data.duelMap.get(round)
        }
        if (!roundInfo) roundInfo = data.duelMap.get(round - 1)
        if (!roundInfo) continue
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(duelStillImage, 0, 0, canvasWidth, canvasHeight)

        console.log({
          leftTeam: roundInfo.leftTeamData.map(p => {
            return {
              poke: p.name,
              hp: p.hp,
            }
          }),
          rightTeam: roundInfo.rightTeamData.map(p => {
            return {
              poke: p.name,
              hp: p.hp,
            }
          }),
        })

        const rPoke1Sprite = rightTeamSprites.get(roundInfo.rightTeamData[0]?.id)
        const rPoke2Sprite = rightTeamSprites.get(roundInfo.rightTeamData[1]?.id)
        const lPoke1Sprite = leftTeamSprites.get(roundInfo.leftTeamData[0]?.id)
        const lPoke2Sprite = leftTeamSprites.get(roundInfo.leftTeamData[1]?.id)

        ctx.fillStyle = 'white'

        if (rPoke1Sprite) {
          ctx.drawImage(rPoke1Sprite, 240, 165, 250, 250)
          ctx.font = '14px Righteous'
          ctx.fillText(roundInfo.rightTeamData[0].name, 321, 93)
          ctx.textAlign = 'start'
          ctx.fillText(roundInfo.rightTeamData[0].level.toString(), 470, 93)
          ctx.fillStyle = `rgb(160,40,40)`
          ctx.fillRect(
            365,
            65,
            Math.max(0, (roundInfo.rightTeamData[0].hp / roundInfo.rightTeamData[0].maxHp) * 125),
            7
          )
          ctx.fillStyle = `rgb(50,121,211)`
          ctx.fillRect(365 - 55, 103, Math.max(0, (roundInfo.rightTeamData[0].mana / 100) * 175), 3)
        }

        if (rPoke2Sprite) {
          ctx.drawImage(rPoke2Sprite, 315, 165, 250, 250)
          ctx.font = '14px Righteous'
          ctx.fillText(roundInfo.rightTeamData[1].name, 321, 150)
          ctx.textAlign = 'start'
          ctx.fillText(roundInfo.rightTeamData[1].level.toString(), 470, 150)
          ctx.fillStyle = `rgb(160,40,40)`
          ctx.fillRect(
            365,
            120,
            Math.max(0, (roundInfo.rightTeamData[1].hp / roundInfo.rightTeamData[1].maxHp) * 125),
            7
          )
          ctx.fillStyle = `rgb(50,121,211)`
          ctx.fillRect(365 - 55, 158, Math.max(0, (roundInfo.rightTeamData[1].mana / 100) * 175), 3)
        }

        if (lPoke1Sprite) {
          ctx.translate(250, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(lPoke1Sprite, -50, 165, 250, 250)
          ctx.translate(250, 0)
          ctx.scale(-1, 1)
          ctx.font = '14px Righteous'
          ctx.fillText(roundInfo.leftTeamData[0].name, 45, 93)
          ctx.textAlign = 'start'
          ctx.fillText(roundInfo.leftTeamData[0].level.toString(), 200, 93)
          ctx.fillStyle = `rgb(160,40,40)`
          ctx.fillRect(55, 65, Math.max(0, (roundInfo.leftTeamData[0].hp / roundInfo.leftTeamData[0].maxHp) * 125), 7)
          ctx.fillStyle = `rgb(50,121,211)`
          ctx.fillRect(55 - 55, 103, Math.max(0, (roundInfo.leftTeamData[0].mana / 103) * 175), 3)
        }

        if (lPoke2Sprite) {
          ctx.translate(250, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(lPoke2Sprite, 25, 165, 250, 250)
          ctx.translate(250, 0)
          ctx.scale(-1, 1)
          ctx.font = '14px Righteous'
          ctx.fillText(roundInfo.leftTeamData[1].name, 45, 150)
          ctx.textAlign = 'start'
          ctx.fillText(roundInfo.leftTeamData[1].level.toString(), 200, 150)
          ctx.fillStyle = `rgb(160,40,40)`
          ctx.fillRect(55, 120, Math.max(0, (roundInfo.leftTeamData[1].hp / roundInfo.leftTeamData[1].maxHp) * 125), 7)
          ctx.fillStyle = `rgb(50,121,211)`
          ctx.fillRect(55 - 55, 158, Math.max(0, (roundInfo.leftTeamData[1].mana / 100) * 175), 3)
        }

        // write skills
        ctx.font = '18px Righteous'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'start'
        if (i % 6 !== 0) {
          ctx.fillText(roundInfo.leftTeamData[0]?.currentSkillName ?? '', 15, 411)
          ctx.fillText(roundInfo.leftTeamData[1]?.currentSkillName ?? '', 15, 477)

          ctx.fillText(roundInfo.rightTeamData[0]?.currentSkillName ?? '', 315, 411)
          ctx.fillText(roundInfo.rightTeamData[1]?.currentSkillName ?? '', 315, 477)
        }

        // draw skill types

        const leftFlag0 = skillFlagImagesMap.get(roundInfo.leftTeamData[0]?.currentSkillType ?? '')
        if (leftFlag0) ctx.drawImage(leftFlag0, 131, 393, 75, 25)
        const leftFlag1 = skillFlagImagesMap.get(roundInfo.leftTeamData[1]?.currentSkillType ?? '')
        if (leftFlag1) ctx.drawImage(leftFlag1, 131, 451, 75, 25)
        const rightFlag0 = skillFlagImagesMap.get(roundInfo.rightTeamData[0]?.currentSkillType ?? '')
        if (rightFlag0) ctx.drawImage(rightFlag0, 421, 393, 75, 25)
        const rightFlag1 = skillFlagImagesMap.get(roundInfo.rightTeamData[1]?.currentSkillType ?? '')
        if (rightFlag1) ctx.drawImage(rightFlag1, 421, 451, 75, 25)

        ctx.font = '32px Righteous'
        ctx.textAlign = 'center'
        ctx.fillText(`Round ${round}`, 250, 31)

        // write crits
        ctx.font = '32px Righteous'
        ctx.fillStyle = 'yellow'
        ctx.strokeStyle = 'black'
        ctx.textAlign = 'start'

        if (roundInfo.rightTeamData[0]?.crit && i < data.roundCount * framesPerRound) {
          ctx.fillText(`CRITICAL!`, 365, 180)
          ctx.strokeText(`CRITICAL!`, 365, 180)
        }

        if (roundInfo.leftTeamData[0]?.crit && i < data.roundCount * framesPerRound) {
          ctx.fillText(`CRITICAL!`, 55, 180)
          ctx.strokeText(`CRITICAL!`, 55, 180)
        }

        if (roundInfo.rightTeamData[1]?.crit && i < data.roundCount * framesPerRound) {
          ctx.fillText(`CRITICAL!`, 365, 195)
          ctx.strokeText(`CRITICAL!`, 365, 195)
        }

        if (roundInfo.leftTeamData[1]?.crit && i < data.roundCount * framesPerRound) {
          ctx.fillText(`CRITICAL!`, 55, 195)
          ctx.strokeText(`CRITICAL!`, 55, 195)
        }

        ctx.fillStyle = 'blue'

        if (roundInfo.rightTeamData[0]?.block && i < data.roundCount * framesPerRound) {
          ctx.fillText(`BLOCK!`, 365, 215)
          ctx.strokeText(`BLOCK!`, 365, 215)
        }

        if (roundInfo.leftTeamData[0]?.block && i < data.roundCount * framesPerRound) {
          ctx.fillText(`BLOCK!`, 55, 215)
          ctx.strokeText(`BLOCK!`, 55, 215)
        }
        if (roundInfo.rightTeamData[1]?.block && i < data.roundCount * framesPerRound) {
          ctx.fillText(`BLOCK!`, 365, 231)
          ctx.strokeText(`BLOCK!`, 365, 231)
        }

        if (roundInfo.leftTeamData[1]?.block && i < data.roundCount * framesPerRound) {
          ctx.fillText(`BLOCK!`, 55, 231)
          ctx.strokeText(`BLOCK!`, 55, 231)
        }

        if (i > data.roundCount * framesPerRound) {
          ctx.font = '32px Righteous'
          ctx.fillStyle = 'green'
          ctx.strokeStyle = 'black'
          ctx.textAlign = 'center'
          ctx.fillText(`VENCEDOR!`, data.winnerSide === 'right' ? 365 : 105, 180)
          ctx.strokeText(`VENCEDOR!`, data.winnerSide === 'right' ? 365 : 105, 180)
        }

        encoder.addFrame(ctx as any)
      }

      // Finish encoding the GIF
      encoder.finish()

      return filepath
    }

    const filepath = processCode()
    resolve(filepath)
  })

  removeFileFromDisk(filepath, 60000)

  Promise.all(filepath)

  return filepath
}
