import { BasePokemon, Pokemon } from '@prisma/client'
import { loadImage } from 'canvas'
import { talentIdMap } from '../../../server/constants/talentIdMap'
import {
  TCanvas2D,
  createCanvas2d,
  drawBackground,
  drawTalents,
  writeSkills,
} from '../../../server/helpers/canvasHelper'
import { removeFileFromDisk } from '../../../server/helpers/fileHelper'
import path from 'path'
import { initEncoder } from '../../../server/helpers/encoderHelper'

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

export const iGenDuelRound = async ({
  winnerPokemon,
  loserPokemon,
  winnerDataName,
  loserDataName,
  roundCount,
  duelMap,
}: TDuelRoundData) => {
  const random = Math.random()

  const rightPokemon = random >= 0.5 ? winnerPokemon : loserPokemon
  const leftPokemon = random >= 0.5 ? loserPokemon : winnerPokemon

  const canvas2d = await createCanvas2d(1)

  const backgroundImageUrl = './src/assets/sprites/UI/hud/duel_x1_round.png'
  drawBackground(canvas2d, backgroundImageUrl)

  const filepath = path.join(__dirname, `/images/animation-${Math.random()}.gif`)

  const encoder = initEncoder(filepath)

  const pokemonRightSideTalents = getTalents(rightPokemon)
  const pokemonleftSideTalents = getTalents(leftPokemon)

  const framesPerRound = 4
  let round = 1
  let roundInfo = duelMap.get(round)
  let isDuelInProgress = true

  const winnerHpBarXOffset = random >= 0.5 ? 365 : 55
  const loserHpBarXOffset = random >= 0.5 ? 55 : 365

  for (let i = 0; i < roundCount * framesPerRound + 40; i++) {
    if (i > round * framesPerRound && isDuelInProgress) {
      round++
      roundInfo = duelMap.get(round)
    }

    canvas2d.clearArea()

    await drawTalents(canvas2d, pokemonRightSideTalents, 305)
    await drawTalents(canvas2d, pokemonleftSideTalents, 5)

    drawHpBars(canvas2d, winnerHpBarXOffset, roundInfo[winnerDataName].hp, roundInfo[winnerDataName].maxHp)
    drawHpBars(canvas2d, loserHpBarXOffset, roundInfo[loserDataName].hp, roundInfo[loserDataName].maxHp)

    drawManaBars(canvas2d, loserHpBarXOffset, roundInfo[loserDataName].mana)
    drawManaBars(canvas2d, winnerHpBarXOffset, roundInfo[winnerDataName].mana)

    await drawPokemons(canvas2d, rightPokemon.spriteUrl, 285, 165)
    await drawPokemons(canvas2d, leftPokemon.spriteUrl, 0, 165)

    const positionX = rightPokemon === winnerPokemon ? 15 : 315

    if (i % 6 !== 0) {
      writeSkills({
        canvas2d,
        value: roundInfo[loserDataName].currentSkillName,
        positionX,
      })

      writeSkills({
        canvas2d,
        value: roundInfo[winnerDataName].currentSkillName,
        positionX,
      })
    }

    await drawSkillTypeFlags(canvas2d, roundInfo, winnerDataName, loserDataName, rightPokemon, winnerPokemon)
    drawTexts(canvas2d, roundInfo, winnerDataName, loserDataName, rightPokemon, leftPokemon, winnerPokemon, round)

    if (roundInfo[winnerDataName].crit && (isDuelInProgress || i < roundCount * framesPerRound)) {
      drawCriticalText(canvas2d, winnerHpBarXOffset)
    }

    if (roundInfo[loserDataName].crit && (isDuelInProgress || i < roundCount * framesPerRound)) {
      drawCriticalText(canvas2d, loserHpBarXOffset)
    }

    if (roundInfo[winnerDataName].block && (isDuelInProgress || i < roundCount * framesPerRound)) {
      drawBlockText(canvas2d, winnerHpBarXOffset)
    }

    if (roundInfo[loserDataName].block && (isDuelInProgress || i < roundCount * framesPerRound)) {
      drawBlockText(canvas2d, loserHpBarXOffset)
    }

    if (
      roundInfo[winnerDataName].hasUltimate &&
      roundInfo[winnerDataName].currentSkillName === roundInfo[winnerDataName].ultimateName &&
      (isDuelInProgress || i < roundCount * framesPerRound)
    ) {
      drawUltimateText(canvas2d, winnerHpBarXOffset, roundInfo[winnerDataName].currentSkillName)
    }

    if (
      roundInfo[loserDataName].hasUltimate &&
      roundInfo[loserDataName].currentSkillName === roundInfo[loserDataName].ultimateName &&
      (isDuelInProgress || i < roundCount * framesPerRound)
    ) {
      drawUltimateText(canvas2d, loserHpBarXOffset, roundInfo[loserDataName].currentSkillName)
    }

    const positionXWinner = rightPokemon === winnerPokemon ? 365 : 105

    if (!isDuelInProgress && i > roundCount * framesPerRound) {
      drawWinnerText(canvas2d, positionXWinner)
    }

    canvas2d.addFrameToEncoder(encoder)

    if (roundInfo.poke1hp <= 0 || roundInfo.poke2hp <= 0) isDuelInProgress = false
  }

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

const drawPokemons = async (canvas2d: TCanvas2D, imageUrl: string, positionX: number, positionY: number) => {
  canvas2d.draw({
    image: await loadImage(imageUrl),
    positionX,
    positionY,
    width: 250,
    height: 250,
  })
}

const drawSkillTypeFlags = async (
  canvas2d: TCanvas2D,
  roundInfo: number,
  winnerDataName: string,
  loserDataName: string,
  rightPokemon: duelPokemon,
  winnerPokemon: duelPokemon
) => {
  const getSkillTypeFlag = (pokeData: any, who: 'winner' | 'loser') => {
    if (pokeData.pokecurrentSkillName === pokeData.pokeskillName) {
      if (who === 'winner') return winnerPokeSkillTypeSprite
      return loserPokeSkillTypeSprite
    }

    if (who === 'winner') return winnerPokeUltimateTypeSprite
    return loserPokeUltimateTypeSprite
  }

  const winnerPokeSkillTypeSprite = await loadImage(
    `./src/assets/sprites/UI/types/${roundInfo[winnerDataName].skillType}.png`
  )
  const loserPokeSkillTypeSprite = await loadImage(
    `./src/assets/sprites/UI/types/${roundInfo[loserDataName].skillType}.png`
  )
  const winnerPokeUltimateTypeSprite = await loadImage(
    `./src/assets/sprites/UI/types/${roundInfo[winnerDataName].ultimateType}.png`
  )
  const loserPokeUltimateTypeSprite = await loadImage(
    `./src/assets/sprites/UI/types/${roundInfo[loserDataName].ultimateType}.png`
  )

  const positionX = rightPokemon === winnerPokemon ? 421 : 131

  canvas2d.draw({
    image: getSkillTypeFlag(roundInfo[winnerDataName], 'winner'),
    positionX,
    positionY: 460,
    width: 75,
    height: 25,
  })
  canvas2d.draw({
    image: getSkillTypeFlag(roundInfo[loserDataName], 'loser'),
    positionX: rightPokemon === winnerPokemon ? 421 : 131,
    positionY: 460,
    width: 75,
    height: 25,
  })
}

const drawTexts = (
  canvas2d: TCanvas2D,
  roundInfo: number,
  winnerDataName: string,
  loserDataName: string,
  rightPokemon: duelPokemon,
  leftPokemon: duelPokemon,
  winnerPokemon: duelPokemon,
  round: number
) => {
  const positionXWinner = rightPokemon === winnerPokemon ? 365 : 105

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: roundInfo[winnerDataName].currentSkillName,
    textAlign: 'start',
    positionX: positionXWinner,
    positionY: 180,
  })

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: roundInfo[loserDataName].currentSkillName,
    textAlign: 'start',
    positionX: positionXWinner,
    positionY: 180,
  })

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: rightPokemon.baseData.name,
    textAlign: 'start',
    positionX: 350,
    positionY: 135,
  })

  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    text: leftPokemon.baseData.name,
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

const drawUltimateText = (canvas2d: TCanvas2D, xOffset: number, text: string) => {
  canvas2d.write({
    font: '24px Righteous',
    fillStyle: 'white',
    strokeStyle: 'black',
    text,
    textAlign: 'start',
    positionX: xOffset,
    positionY: 235,
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
