import { Image } from 'canvas'
import path from 'path'
import { talentIdMap } from '../../../common/constants/talentIdMap'
import { RoundPokemonData } from '../../../common/types'
import { TCanvas2D, createCanvas2d, drawBackground, drawTalents, writeSkills } from './helpers/canvasHelper'
import { initEncoder } from './helpers/encoderHelper'
import { removeFileFromDisk, saveFileOnDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'
import { TDuelRoundData } from './iGenDuel2X1Rounds'

export const iGenDuelRound = async (data: TDuelRoundData) => {
  const rightPokemon = data.rightTeam[0]
  const leftPokemon = data.leftTeam[0]
  const { duelMap } = data

  const canvas2d = await createCanvas2d(1)

  const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

  const encoder = initEncoder(filepath)

  const pokemonRightSideTalents = getTalents(rightPokemon)
  const pokemonleftSideTalents = getTalents(leftPokemon)

  const framesPerRound = 4
  let round = data.staticImage ? data.roundCount : 1
  let roundInfo = duelMap.get(round)

  const rightHpBarXOffset = 365
  const leftHpBarXOffset = 55

  const bg1 = `./src/assets/sprites/UI/hud/duel_bg/${rightPokemon.type1}.png`
  const bg2 = `./src/assets/sprites/UI/hud/duel_bg/${rightPokemon.type2 || rightPokemon.type1}.png`
  const bgs = [bg1, bg2]

  const backgroundUrl = bgs[Math.floor(Math.random() * bgs.length)]
  const backgroundImage = await loadOrSaveImageFromCache(backgroundUrl)
  const hudImage = await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/duel_x1_round.png')
  const rightPokemonImage = await loadOrSaveImageFromCache(rightPokemon.spriteUrl)
  const leftPokemonImage = await loadOrSaveImageFromCache(leftPokemon.spriteUrl)

  const talentImageMap = new Map<string, Image>([])

  for (const talent of [pokemonRightSideTalents, pokemonleftSideTalents].flat()) {
    if (!talent) continue
    talentImageMap.set(talent, await loadOrSaveImageFromCache(`./src/assets/sprites/UI/types/circle/${talent}.png`))
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

  const leftPokeCanvas = await createCanvas2d(1, false, 250)

  drawBackground(canvas2d, backgroundImage)
  drawBackground(canvas2d, hudImage)

  drawTalents(canvas2d, talentImageMap, pokemonRightSideTalents, 305)
  drawTalents(canvas2d, talentImageMap, pokemonleftSideTalents, 5)

  drawPokemons(canvas2d, rightPokemonImage, 285, 165, rightPokemon.isGiant)

  leftPokeCanvas.invertHorizontally()
  leftPokeCanvas.draw({
    height: 250 * (leftPokemon.isGiant ? 1.25 : 1),
    width: 250 * (leftPokemon.isGiant ? 1.25 : 1),
    positionX: 0,
    positionY: 165,
    image: leftPokemonImage,
  })
  canvas2d.draw({
    height: 500,
    width: 250,
    positionX: 0,
    positionY: 0,
    image: leftPokeCanvas.canvas,
  })

  const buffer = canvas2d.toBuffer()
  const stillBackground = await loadOrSaveImageFromCache(buffer)

  const totalBattleFrames = data.staticImage ? 1 : data.roundCount * framesPerRound + 40

  // Gravar o tempo de início
  const start = performance.now()

  for (let i = 0; i < totalBattleFrames; i++) {
    if (i > round * framesPerRound && i < totalBattleFrames) {
      round++
      roundInfo = duelMap.get(round)
      if (!roundInfo) roundInfo = duelMap.get(round - 1)
    }
    if (!roundInfo) continue

    canvas2d.clearArea()
    canvas2d.draw({
      height: 500,
      width: 500,
      image: stillBackground,
      positionX: 0,
      positionY: 0,
    })

    drawHpBars(canvas2d, rightHpBarXOffset, roundInfo.rightTeamData[0].hp, roundInfo.rightTeamData[0].maxHp)
    drawHpBars(canvas2d, leftHpBarXOffset, roundInfo.leftTeamData[0].hp, roundInfo.leftTeamData[0].maxHp)

    drawManaBars(canvas2d, leftHpBarXOffset, roundInfo.leftTeamData[0].mana)
    drawManaBars(canvas2d, rightHpBarXOffset, roundInfo.rightTeamData[0].mana)

    writeSkills({
      canvas2d,
      value: roundInfo.leftTeamData[0].currentSkillName ?? '',
      positionX: 15,
      positionY: 480,
    })

    writeSkills({
      canvas2d,
      value: roundInfo.rightTeamData[0].currentSkillName ?? '',
      positionX: 305,
      positionY: 480,
    })

    // draw skill types
    if (i % 6 !== 0 || data.staticImage) {
      const leftFlag0 = skillFlagImagesMap.get(roundInfo.leftTeamData[0].currentSkillType ?? '')
      if (leftFlag0) canvas2d.draw({ image: leftFlag0, positionX: 131, positionY: 465, width: 75, height: 25 })

      const rightFlag0 = skillFlagImagesMap.get(roundInfo.rightTeamData[0].currentSkillType ?? '')
      if (rightFlag0) canvas2d.draw({ image: rightFlag0, positionX: 421, positionY: 465, width: 75, height: 25 })
    }
    drawTexts(canvas2d, rightPokemon, leftPokemon, round)

    if (roundInfo.rightTeamData[0].crit && i < totalBattleFrames) {
      drawCriticalText(canvas2d, rightHpBarXOffset)
    }

    if (roundInfo.leftTeamData[0].crit && i < totalBattleFrames) {
      drawCriticalText(canvas2d, leftHpBarXOffset)
    }

    if (roundInfo.rightTeamData[0].block && i < totalBattleFrames) {
      drawBlockText(canvas2d, rightHpBarXOffset)
    }

    if (roundInfo.leftTeamData[0].block && i < totalBattleFrames) {
      drawBlockText(canvas2d, leftHpBarXOffset)
    }

    if (i > data.roundCount * framesPerRound || data.staticImage) {
      if (data.winnerSide === 'right') drawWinnerText(canvas2d, 365)
      if (data.winnerSide === 'left') drawWinnerText(canvas2d, 105)
    }

    if (data.staticImage) {
      const filepath = await saveFileOnDisk(canvas2d) // Salvamento do canvas como um arquivo no disco
      removeFileFromDisk(filepath) // Remoção do arquivo do disco
      return filepath // Retorno do caminho do arquivo
    }
    canvas2d.addFrameToEncoder(encoder)
  }

  // Gravar o tempo de término
  const end = performance.now()
  // Calcular a diferença entre o tempo de término e o tempo de início
  const executionTime = end - start
  console.log(`Tempo de execução: ${executionTime} ms`)

  encoder.finish()

  removeFileFromDisk(filepath)

  return filepath
}

const drawHpBars = (canvas2d: TCanvas2D, xOffset: number, hp: number, maxHp: number) => {
  canvas2d.drawBar({
    type: 'hp',
    xOffset: xOffset,
    value: hp / maxHp,
  })
}

const drawManaBars = (canvas2d: TCanvas2D, xOffset: number, mana: number) => {
  canvas2d.drawBar({ type: 'mana', xOffset, value: mana / 100 })
}

const drawPokemons = (canvas2d: TCanvas2D, image: Image, positionX: number, positionY: number, isGiant: boolean) => {
  canvas2d.draw({
    image,
    positionX,
    positionY,
    width: 250 * (isGiant ? 1.25 : 1),
    height: 250 * (isGiant ? 1.25 : 1),
  })
}

const drawTexts = (
  canvas2d: TCanvas2D,
  rightPokemon: RoundPokemonData,
  leftPokemon: RoundPokemonData,
  round: number
) => {
  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: rightPokemon.name,
    textAlign: 'start',
    positionX: 350,
    positionY: 135,
  })

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: leftPokemon.name,
    textAlign: 'start',
    positionX: 65,
    positionY: 135,
  })

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: rightPokemon.level.toString(),
    textAlign: 'start',
    positionX: 470,
    positionY: 135,
  })

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: leftPokemon.level.toString(),
    textAlign: 'start',
    positionX: 200,
    positionY: 135,
  })

  canvas2d.write({
    font: '32px Righteous',
    fillStyle: 'white',
    text: `Round ${round}`,
    textAlign: 'center',
    positionX: 250,
    positionY: 52,
  })
}

const drawCriticalText = (canvas2d: TCanvas2D, xOffset: number) => {
  canvas2d.write({
    font: '32px Righteous',
    fillStyle: 'yellow',
    strokeStyle: 'black',
    text: `CRITICAL!`,
    textAlign: 'start',
    positionX: xOffset,
    positionY: 180,
    strokeText: true,
  })
}

const drawBlockText = (canvas2d: TCanvas2D, xOffset: number) => {
  canvas2d.write({
    font: '32px Righteous',
    fillStyle: 'blue',
    strokeStyle: 'black',
    text: `BLOCK!`,
    textAlign: 'start',
    positionX: xOffset,
    positionY: 215,
    strokeText: true,
  })
}

const drawWinnerText = (canvas2d: TCanvas2D, xOffset: number) => {
  canvas2d.write({
    font: '32px Righteous',
    fillStyle: 'green',
    strokeStyle: 'black',
    text: 'VENCEDOR!',
    textAlign: 'center',
    positionX: xOffset,
    positionY: 180,
    strokeText: true,
  })
}

const getTalents = (playerData: any) => {
  const talents: (string | undefined)[] = []
  for (let i = 1; i <= 9; i++) {
    const talent = talentIdMap.get(playerData[`talentId${i}`])
    talents.push(talent)
  }
  return talents
}
