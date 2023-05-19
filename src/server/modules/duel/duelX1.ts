import { ISkill } from "server/models/ISkill"
import { talentIdMap } from "../../../server/constants/talentIdMap"
import { findKeyByValue } from "../../../server/helpers/findKeyByValue"
import { getPairWithHighestKey } from "../../../server/helpers/getPairWithHighestKey"
import { IPokemon } from "../../../server/models/IPokemon"
import { defEffectivenessMap } from "../../constants/defEffectivenessMap"

type TParams = {
  poke1: IPokemon
  poke2: IPokemon
}

type TResponse = {
  winner: IPokemon | null
  loser: IPokemon | null
  message: string
  isDraw: boolean
}

export const duelX1 = async (data: TParams): Promise<TResponse | void> => {
  console.log(
    `starting duel process between ${data.poke1.baseData.name} and ${data.poke2.baseData.name} `
  )

  /// will try to get the best possible skill ///
  const poke1Skill = await getBestSkills({
    attacker: data.poke1,
    defender: data.poke2,
  })
  const poke2Skill = await getBestSkills({
    attacker: data.poke2,
    defender: data.poke1,
  })

  console.log({ poke1Skill })
  console.log({ poke2Skill })

  if (!poke1Skill || !poke1Skill[1] || !poke1Skill[0]) {
    console.error("no pokeskill1")
    return
  }

  if (!poke2Skill || !poke2Skill[1] || !poke2Skill[0]) {
    console.error("no pokeskill2")
    return
  }

  const poke1Data = {
    name: data.poke1.baseData.name,
    level: data.poke1.level,
    hp:
      ((2 * data.poke1.hp + 97) * data.poke1.level) / 100 +
      data.poke1.level +
      10,
    speed: data.poke1.speed,
    skillPower: poke1Skill[0],
    skillName: poke1Skill[1][0].name,
  }

  const poke2Data = {
    name: data.poke2.baseData.name,
    level: data.poke2.level,
    hp:
      ((2 * data.poke2.hp + 97) * data.poke2.level) / 100 +
      data.poke2.level +
      10,
    speed: data.poke2.speed,
    skillPower: poke2Skill[0],
    skillName: poke2Skill[1][0].name,
  }

  console.log(poke1Data)
  console.log(poke2Data)

  let duelFinished = false
  let isDraw = false
  let roundCount = 0
  let winner: IPokemon | null = null

  while (duelFinished === false) {
    roundCount++
    poke1Data.hp -= poke2Data.skillPower
    if (poke1Data.hp < 0) {
      winner = data.poke2
      console.log(
        `${poke2Data.name} derrota ${poke1Data.name} no round ${roundCount} utilizando ${poke2Data.skillName}`
      )
      duelFinished = true
    }

    poke2Data.hp -= poke1Data.skillPower
    if (poke2Data.hp < 0) {
      winner = data.poke1
      console.log(
        `${poke1Data.name} derrota ${poke2Data.name} no round ${roundCount} utilizando ${poke1Data.skillName}`
      )
      duelFinished = true
    }

    console.log(
      `round: ${roundCount} - ${poke1Data.name}: ${poke1Data.hp} VS ${poke2Data.name}: ${poke2Data.hp}`
    )

    if (roundCount > 30) {
      duelFinished = true
      isDraw = true
    }
  }

  return {
    message: `${poke1Data.name} derrota ${poke2Data.name} no round ${roundCount} utilizando ${poke1Data.skillName}`,
    isDraw: isDraw,
    winner: winner,
    loser: winner === data.poke1 ? data.poke2 : data.poke1,
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
    .filter((entry) => {
      if (entry[1] === 2) return entry[0]
    })
    .flat()
    .filter((entry) => typeof entry === "string")

  const entrymap1 = entries
    .filter((entry) => {
      if (entry[1] === 1) return entry[0]
    })
    .flat()
    .filter((entry) => typeof entry === "string")

  const entrymap0 = entries
    .filter((entry) => {
      if (entry[1] === 0) return entry[0]
    })
    .flat()
    .filter((entry) => typeof entry === "string")

  const entrymapBad = entries
    .filter((entry) => {
      if (entry[1] === -1) return entry[0]
    })
    .flat()
    .filter((entry) => typeof entry === "string")

  const entrymapWorse = entries
    .filter((entry) => {
      if (entry[1] === -2) return entry[0]
    })
    .flat()
    .filter((entry) => typeof entry === "string")

  return {
    best: entrymap2,
    good: entrymap1,
    neutral: entrymap0,
    bad: entrymapBad,
    worse: entrymapWorse,
  }
}

const getBestSkills = async ({ attacker, defender }: any) => {
  const efData = await getBestTypes(
    defender.baseData.type1Name,
    defender.baseData.type2Name
  )
  const skills = attacker.baseData.skills
  const skillTable = attacker.baseData.skillTable
  const learnedSkills: string[] = []

  for (const skill of skillTable) {
    const split = skill.split("%")
    if (Number(split[1]) <= attacker.level) {
      learnedSkills.push(split[0])
    }
  }

  const finalSkillMap = new Map<number, any[]>([])

  let count = 0
  console.log({ skills: skills.length })
  console.log({ learnedSkills })

  for (const skill of skills) {
    const isPermited = await verifyTalentPermission(attacker, skill)
    if (!isPermited) {
      count++
      console.log({ count })
      continue
    }
    const stab = () => {
      if (attacker.type1Name === skill.typeName) return 1.15
      if (attacker.type2Name === skill.typeName) return 1.15
      return 1
    }
    const adRatio = () => {
      if (skill.isPhysical) return attacker.atk / defender.def
      return attacker.spAtk / defender.spDef
    }

    if (
      efData.best.includes(skill.typeName) &&
      learnedSkills.includes(skill.name)
    ) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 +
          2) *
        2 *
        stab()
      finalSkillMap.set(Number(power.toFixed(2)), [
        ...(finalSkillMap.get(power) || []),
        skill,
      ])
      continue
    }
    if (
      efData.good.includes(skill.typeName) &&
      learnedSkills.includes(skill.name)
    ) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 +
          2) *
        1.5 *
        stab()
      finalSkillMap.set(Number(power.toFixed(2)), [
        ...(finalSkillMap.get(power) || []),
        skill,
      ])
      continue
    }
    if (
      efData.neutral.includes(skill.typeName) &&
      learnedSkills.includes(skill.name)
    ) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 +
          2) *
        1 *
        stab()
      console.log(skill.name, power)
      finalSkillMap.set(Number(power.toFixed(2)), [
        ...(finalSkillMap.get(power) || []),
        skill,
      ])
    }

    if (
      efData.bad.includes(skill.typeName) &&
      learnedSkills.includes(skill.name)
    ) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 +
          2) *
        0.5 *
        stab()
      finalSkillMap.set(Number(power.toFixed(2)), [
        ...(finalSkillMap.get(power) || []),
        skill,
      ])
    }

    if (
      efData.worse.includes(skill.typeName) &&
      learnedSkills.includes(skill.name)
    ) {
      const power =
        (((attacker.level * 0.4 + 2) * skill.attackPower * adRatio()) / 50 +
          2) *
        0.25 *
        stab()
      finalSkillMap.set(Number(power.toFixed(2)), [
        ...(finalSkillMap.get(power) || []),
        skill,
      ])
    }
  }

  console.log({ finalSkillMap })
  const bestSkill = getPairWithHighestKey(finalSkillMap)
  return bestSkill
}

const verifyTalentPermission = async (poke: IPokemon, skill: ISkill) => {
  if (
    poke.baseData.type1Name === skill.typeName ||
    poke.baseData.type2Name === skill.typeName
  )
    return true
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

  const count = talents.reduce(
    (count, current) => count + (current === typeId ? 1 : 0),
    0
  )

  if (
    count >= 3 ||
    (count >= 2 && skill.attackPower <= 75) ||
    (count === 1 && skill.attackPower <= 40) ||
    (skill.typeName === "normal" && skill.attackPower <= 40)
  )
    return true

  return false
}
