import { BasePokemon, Pokemon } from '@prisma/client'
import { typeEffectivenessMap } from '../../../server/constants/atkEffectivenessMap'
import { talentIdMap } from '../../../server/constants/talentIdMap'
import { findKeyByValue } from '../../../server/helpers/findKeyByValue'
import { getBestSkillPair } from '../../helpers/getBestSkillPair'
import { IPokemon } from '../../../server/models/IPokemon'
import { ISkill } from '../../../server/models/ISkill'
import { defEffectivenessMap } from '../../constants/defEffectivenessMap'
import { iGenDuelRound } from '../imageGen/iGenDuelRound'
import { getTeamBonuses } from './getTeamBonuses'
import { iGenWildPokemonBattle } from '../imageGen/iGenWildPokemonBattle'
import { UnexpectedError } from '../../../infra/errors/AppErrors'

type TParams = {
  poke1: Pokemon & {
    baseData: BasePokemon
  }
  poke2: Pokemon & {
    baseData: BasePokemon
  }
  againstWildPokemon?: boolean
}

type TResponse = {
  winner: any | null
  loser: any | null
  message: string
  isDraw: boolean
  imageUrl: string
}

export const duelX1 = async (data: TParams): Promise<TResponse | void> => {
  /// apply team-bonuses to the pokemons
  const poke1 = await getTeamBonuses({
    poke: data.poke1,
    team: undefined,
  })
  const poke2 = await getTeamBonuses({
    poke: data.poke2,
    team: undefined,
  })
  /// will try to get the best possible skill ///
  const poke1Skill = await getBestSkills({
    attacker: poke1,
    defender: poke2,
  })
  const poke2Skill = await getBestSkills({
    attacker: poke2,
    defender: poke1,
  })

  const poke1Data = {
    name: poke1.baseData.name,
    id: poke1.id,
    ownerId: poke1.ownerId,
    type1: poke1.baseData.type1Name,
    type2: poke1.baseData.type2Name,
    level: poke1.level,
    maxHp: 4 * poke1.hp,
    hp: 4 * poke1.hp,
    speed: poke1.speed,
    skillPower: poke1Skill[0] ? poke1Skill[0][0] : 2,
    skillName: poke1Skill[0] ? poke1Skill[0][1].name : 'basic-attack',
    skillType: poke1Skill[0] ? poke1Skill[0][1].typeName : 'normal',
    ultimatePower: poke1Skill[1] ? poke1Skill[1][0] : 2,
    ultimateName: poke1Skill[1] ? poke1Skill[1][1].name : 'basic-attack',
    ultimateType: poke1Skill[1] ? poke1Skill[1][1].typeName : 'normal',
    currentSkillPower: poke1Skill[0] ? poke1Skill[0][0] : 2,
    currentSkillName: poke1Skill[0] ? poke1Skill[0][1].name : 'basic-attack',
    currentSkillType: poke1Skill[0] ? poke1Skill[0][1].typeName : 'normal',
    crit: false,
    block: false,
    mana: 0,
    hasUltimate: poke1Skill[0] !== poke1Skill[1],
    manaBonus: poke1.manaBonus || 0,
    lifeSteal: poke1.lifeSteal || 0,
    critChance: poke1.critChance || 0,
    blockChance: poke1.blockChance || 0,
  }

  const poke2Data = {
    name: poke2.baseData.name,
    id: poke2.id,
    ownerId: poke2.ownerId,
    type1: poke2.baseData.type1Name,
    type2: poke2.baseData.type2Name,
    level: poke2.level,
    maxHp: 4 * poke2.hp,
    hp: 4 * poke2.hp,
    speed: poke2.speed,
    skillPower: poke2Skill[0] ? poke2Skill[0][0] : 2,
    skillName: poke2Skill[0] ? poke2Skill[0][1].name : 'basic-attack',
    skillType: poke2Skill[0] ? poke2Skill[0][1].typeName : 'normal',
    ultimatePower: poke2Skill[1] ? poke2Skill[1][0] : 2,
    ultimateName: poke2Skill[1] ? poke2Skill[1][1].name : 'basic-attack',
    ultimateType: poke2Skill[1] ? poke2Skill[1][1].typeName : 'normal',
    currentSkillPower: poke2Skill[0] ? poke2Skill[0][0] : 2,
    currentSkillName: poke2Skill[0] ? poke2Skill[0][1].name : 'basic-attack',
    currentSkillType: poke2Skill[0] ? poke2Skill[0][1].typeName : 'normal',
    crit: false,
    block: false,
    mana: 0,
    hasUltimate: poke2Skill[0] !== poke2Skill[1],
    manaBonus: poke2.manaBonus || 0,
    lifeSteal: poke2.lifeSteal || 0,
    critChance: poke2.critChance || 0,
    blockChance: poke2.blockChance || 0,
  }

  type RoundData = {
    poke1Data: any
    poke2Data: any
  }

  const duelMap = new Map<number, RoundData>([])

  let duelFinished = false
  let isDraw = false
  let roundCount = 1
  let winner: any | null = null
  let loser: any | null = null

  const duelLogs = () => {
    if (
      (typeEffectivenessMap.get(poke1Data.skillType)?.effective.includes(poke2Data.type1) &&
        poke1Data.skillType !== poke1Data.type1 &&
        poke1Data.skillType !== poke2Data.type2) ||
      (typeEffectivenessMap.get(poke1Data.skillType)?.effective.includes(poke2Data.type2 || 'null') &&
        poke1Data.skillType !== poke1Data.type1 &&
        poke1Data.skillType !== poke2Data.type2)
    ) {
      console.log(
        `PREPARAÇÃO: ${poke1Data.name} utiliza seus talentos do tipo ${poke1Data.skillType} para conseguir utilizar ${poke1Data.skillName}. Efetivo contra ${poke2Data.name}`
      )
    }

    if (
      (typeEffectivenessMap.get(poke2Data.skillType)?.effective.includes(poke1Data.type1) &&
        poke2Data.skillType !== poke2Data.type1 &&
        poke2Data.skillType !== poke1Data.type2) ||
      (typeEffectivenessMap.get(poke2Data.skillType)?.effective.includes(poke1Data.type2 || 'null') &&
        poke2Data.skillType !== poke2Data.type1 &&
        poke1Data.skillType !== poke1Data.type2)
    ) {
      console.log(
        `PREPARAÇÃO: ${poke2Data.name} utiliza seus talentos do tipo ${poke2Data.skillType} para conseguir utilizar ${poke2Data.skillName}. Efetivo contra ${poke1Data.name}`
      )
    }

    if (
      typeEffectivenessMap.get(poke1Data.skillType)?.ineffective.includes(poke2Data.type1) ||
      typeEffectivenessMap.get(poke1Data.skillType)?.ineffective.includes(poke2Data.type2 || 'null')
    ) {
      console.log(
        `PREPARAÇÃO: ${poke1Data.name} entra em batalha com ${poke1Data.skillName} do tipo ${poke1Data.skillType}. Inefetivo contra ${poke2Data.name}`
      )
    }

    if (
      typeEffectivenessMap.get(poke2Data.skillType)?.ineffective.includes(poke1Data.type1) ||
      typeEffectivenessMap.get(poke2Data.skillType)?.ineffective.includes(poke1Data.type2 || 'null')
    ) {
      console.log(
        `PREPARAÇÃO: ${poke2Data.name} entra em batalha com ${poke2Data.skillName} do tipo ${poke2Data.skillType}. Inefetivo contra ${poke1Data.name}`
      )
    }

    console.log(`---- 
    ${poke1Data.name.toUpperCase()} com ${poke1Data.skillName} do tipo ${poke1Data.skillType} e ${
      poke1Data.skillPower
    } de poder
    *** VERSUS ***
    ${poke2Data.name.toUpperCase()} com ${poke2Data.skillName} do tipo ${poke2Data.skillType} e ${
      poke2Data.skillPower
    } de poder
    ----`)

    console.log(`---- INICIO DO DUELO ----`)
  }
  duelLogs()

  duelMap.set(1, {
    poke1Data: { ...poke1Data },
    poke2Data: { ...poke2Data },
  })

  while (duelFinished === false) {
    roundCount++
    console.log(
      `Início do round ${roundCount}: ${poke1Data.name} com ${poke1Data.hp}hp VS ${poke2Data.name} com ${poke2Data.hp}hp`
    )
    poke1Data.crit = false
    poke2Data.crit = false
    poke1Data.block = false
    poke2Data.block = false
    poke1Data.mana += 23 * (0.7 + Math.random() * 0.6) + poke1Data.manaBonus
    poke2Data.mana += 23 * (0.7 + Math.random() * 0.6) + poke2Data.manaBonus

    if (poke1Data.mana >= 100) {
      poke1Data.mana = 0
      poke1Data.currentSkillName = poke1Data.ultimateName
      poke1Data.currentSkillPower = poke1Data.ultimatePower
      poke1Data.currentSkillType = poke1Data.ultimateType
    } else {
      poke1Data.currentSkillName = poke1Data.skillName
      poke1Data.currentSkillPower = poke1Data.skillPower
      poke1Data.currentSkillType = poke1Data.skillType
    }

    if (poke2Data.mana >= 100) {
      poke2Data.mana = 0
      poke2Data.currentSkillName = poke2Data.ultimateName
      poke2Data.currentSkillPower = poke2Data.ultimatePower
      poke2Data.currentSkillType = poke2Data.ultimateType
    } else {
      poke2Data.currentSkillName = poke2Data.skillName
      poke2Data.currentSkillPower = poke2Data.skillPower
      poke2Data.currentSkillType = poke2Data.skillType
    }

    const isCrit1 = Math.random() + poke1Data.critChance > 0.9
    const isCrit2 = Math.random() + poke2Data.critChance > 0.9
    const isBlock1 = Math.random() + poke1Data.blockChance > 0.9
    const isBlock2 = Math.random() + poke1Data.blockChance > 0.9
    if (isCrit1) poke1Data.crit = true
    if (isCrit2) poke2Data.crit = true
    if (isBlock1) poke1Data.block = true
    if (isBlock2) poke2Data.block = true

    if (poke1Data.speed < poke2Data.speed) {
      if (!isBlock1) {
        poke1Data.hp -= poke2Data.currentSkillPower * (0.9 + Math.random() * 0.2)
        poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal
      }
      if (isCrit2) {
        console.log(`${poke2Data.name} encaixa um ${poke2Data.currentSkillName} crítico!`)
        if (!isBlock1) {
          poke1Data.hp -= poke2Data.currentSkillPower * 0.5
          poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal * 0.5
        }
      }
      if (poke1Data.hp <= 0) {
        winner = poke2Data
        loser = poke1Data
        duelFinished = true
      }

      if (!isBlock2) {
        poke2Data.hp -= poke1Data.currentSkillPower * (0.9 + Math.random() * 0.2)
        poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal
      }
      if (isCrit1) {
        console.log(`${poke1Data.name} encaixa um ${poke1Data.currentSkillName} crítico!`)
        if (!isBlock2) {
          poke2Data.hp -= poke1Data.currentSkillPower * 0.5
          poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal * 0.5
        }
      }
      if (poke2Data.hp <= 0) {
        winner = poke1Data
        loser = poke2Data
        duelFinished = true
      }

      if (roundCount > 60) {
        throw new UnexpectedError('O duelo passou do limite de 60 rounds.')
      }
    } else {
      if (!isBlock2) {
        poke2Data.hp -= poke1Data.currentSkillPower * (0.9 + Math.random() * 0.2)
        poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal
      }
      if (isCrit1) {
        console.log(`${poke1Data.name} encaixa um ${poke1Data.currentSkillName} crítico!`)
        if (!isBlock2) {
          poke2Data.hp -= poke1Data.currentSkillPower * 0.5
          poke1Data.hp += poke1Data.currentSkillPower * poke1Data.lifeSteal * 0.5
        }
      }
      if (poke2Data.hp <= 0) {
        winner = poke1Data
        loser = poke2Data
        duelFinished = true
      }
      if (!isBlock1) {
        poke1Data.hp -= poke2Data.currentSkillPower * (0.9 + Math.random() * 0.2)
        poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal
      }
      if (isCrit2) {
        console.log(`${poke2Data.name} encaixa um ${poke2Data.currentSkillName} crítico!`)
        if (!isBlock1) {
          poke1Data.hp -= poke2Data.currentSkillPower * 0.5
          poke2Data.hp += poke2Data.currentSkillPower * poke2Data.lifeSteal
        }
      }
      if (poke1Data.hp <= 0) {
        winner = poke2Data
        loser = poke1Data
        duelFinished = true
      }

      if (roundCount > 60) {
        throw new UnexpectedError('Duelo passou do limite de 60 rounds.')
      }
    }
    console.log(
      `Fim do round ${roundCount}: ${poke1Data.name} com ${poke1Data.hp}hp VS ${poke2Data.name} com ${poke2Data.hp}hp`
    )
    duelMap.set(roundCount, {
      poke1Data: { ...poke1Data },
      poke2Data: { ...poke2Data },
    })
  }

  const winnerPokemon =
    poke1.id === winner.id
      ? {
          ...poke1,
          skillName: poke1Data.skillName,
          skillType: poke1Data.skillType,
          ultimateType: poke1Data.ultimateType,
        }
      : {
          ...poke2,
          skillName: poke2Data.skillName,
          skillType: poke2Data.skillType,
          ultimateType: poke2Data.ultimateType,
        }

  const loserPokemon =
    poke1.id === loser.id
      ? {
          ...poke1,
          skillName: poke1Data.skillName,
          skillType: poke1Data.skillType,
          ultimateType: poke1Data.ultimateType,
        }
      : {
          ...poke2,
          skillName: poke2Data.skillName,
          skillType: poke2Data.skillType,
          ultimateType: poke2Data.ultimateType,
        }

  console.log('will start to creat gif')

  const imageUrl = data.againstWildPokemon
    ? await iGenWildPokemonBattle({
        winnerPokemon,
        loserPokemon,
        roundCount,
        duelMap,
        winnerDataName: poke1.id === winner.id ? 'poke1Data' : 'poke2Data',
        loserDataName: poke1.id === loser.id ? 'poke1Data' : 'poke2Data',
      })
    : await iGenDuelRound({
        winnerPokemon,
        loserPokemon,
        roundCount,
        duelMap,
        winnerDataName: poke1.id === winner.id ? 'poke1Data' : 'poke2Data',
        loserDataName: poke1.id === loser.id ? 'poke1Data' : 'poke2Data',
      })

  return {
    message: `${winner.name} derrota ${loser.name} no round ${roundCount} utilizando ${winner.skillName}`,
    isDraw: isDraw,
    winner: winner,
    loser: winner === poke1Data ? poke2Data : poke1Data,
    imageUrl,
  }
}

const getBestTypes = (type1: string, type2?: string): any => {
  const efData1 = defEffectivenessMap.get(type1)
  const efData2 = defEffectivenessMap.get(type2 || type1)

  if (!efData1 || !efData2) return null

  const efObj = {
    normal: 0,
    fire: 0,
    water: 0,
    electric: 0,
    grass: 0,
    ice: 0,
    fighting: 0,
    poison: 0,
    ground: 0,
    flying: 0,
    psychic: 0,
    bug: 0,
    rock: 0,
    ghost: 0,
    dragon: 0,
    dark: 0,
    steel: 0,
    fairy: 0,
  }

  for (const type of efData1?.effective) {
    efObj[type] += 1
  }
  for (const type of efData1?.innefective) {
    efObj[type] -= 1
  }
  for (const type of efData1?.noDamage) {
    efObj[type] -= 100
  }

  for (const type of efData2?.effective) {
    if (!efObj[type]) efObj[type] = 0
    efObj[type] += 1
  }
  for (const type of efData2?.innefective) {
    if (!efObj[type]) efObj[type] = 0
    efObj[type] -= 1
  }
  for (const type of efData2?.noDamage) {
    if (!efObj[type]) efObj[type] = 0
    efObj[type] -= 100
  }

  const entries = Object.entries(efObj)
  const entrymap2 = entries
    .filter(entry => {
      if (entry[1] === 2) return entry[0]
    })
    .flat()
    .filter(entry => typeof entry === 'string')

  const entrymap1 = entries
    .filter(entry => {
      if (entry[1] === 1) return entry[0]
    })
    .flat()
    .filter(entry => typeof entry === 'string')

  const entrymap0 = entries
    .filter(entry => {
      if (entry[1] === 0) return entry[0]
    })
    .flat()
    .filter(entry => typeof entry === 'string')

  const entrymapBad = entries
    .filter(entry => {
      if (entry[1] === -1) return entry[0]
    })
    .flat()
    .filter(entry => typeof entry === 'string')

  const entrymapWorse = entries
    .filter(entry => {
      if (entry[1] === -2) return entry[0]
    })
    .flat()
    .filter(entry => typeof entry === 'string')

  return {
    best: entrymap2,
    good: entrymap1,
    neutral: entrymap0,
    bad: entrymapBad,
    worse: entrymapWorse,
  }
}

const getBestSkills = async ({ attacker, defender }: any) => {
  const efData = await getBestTypes(defender.baseData.type1Name, defender.baseData.type2Name)
  const skills = attacker.baseData.skills
  const skillTable = attacker.baseData.skillTable
  const learnedSkills: string[] = []

  for (const skill of skillTable) {
    const split = skill.split('%')
    if (Number(split[1]) <= attacker.level) {
      learnedSkills.push(split[0])
    }
  }

  const finalSkillMap = new Map<number, any[]>([])

  for (const skill of skills) {
    const talentCheck = await verifyTalentPermission(attacker, skill)
    if (!talentCheck.permit) {
      continue
    }
    const stab = () => {
      if (attacker.type1Name === skill.typeName) return 1.1
      if (attacker.type2Name === skill.typeName) return 1.1
      return 1
    }
    const adRatio = () => {
      if (skill.isPhysical) return attacker.atk / defender.def
      return attacker.spAtk / defender.spDef
    }

    const talentBonus = 0.03 * talentCheck.count

    if (efData.best.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 2.5 * stab() * (1 + talentBonus)
      finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill])
      continue
    }
    if (efData.good.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 1.75 * stab() * (1 + talentBonus)
      finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill])
      continue
    }
    if (efData.neutral.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 1 * stab() * (1 + talentBonus)
      finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill])
    }

    if (efData.bad.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 0.5 * stab() * (1 + talentBonus)
      finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill])
    }

    if (efData.worse.includes(skill.typeName) && learnedSkills.includes(skill.name)) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 + 2) * 0.25 * stab() * (1 + talentBonus)
      finalSkillMap.set(Number(power.toFixed(2)), [...(finalSkillMap.get(power) || []), skill])
    }
  }

  return getBestSkillPair(finalSkillMap)
}

const verifyTalentPermission = async (poke: IPokemon, skill: ISkill) => {
  const talents = [
    poke.talentId1,
    poke.talentId2,
    poke.talentId3,
    poke.talentId4,
    poke.talentId5,
    poke.talentId6,
    poke.talentId7,
    poke.talentId8,
    poke.talentId9,
  ]

  const typeId = findKeyByValue(talentIdMap, skill.typeName)

  const count = talents.reduce((count, current) => count + (current === typeId ? 1 : 0), 0)

  if (
    count >= 3 ||
    (count >= 2 && skill.attackPower <= 75) ||
    (count === 1 && skill.attackPower <= 40) ||
    (skill.typeName === 'normal' && skill.attackPower <= 50) ||
    poke.baseData.type1Name === skill.typeName ||
    poke.baseData.type2Name === skill.typeName
  )
    return {
      permit: true,
      count,
    }

  return {
    permit: false,
    count,
  }
}
