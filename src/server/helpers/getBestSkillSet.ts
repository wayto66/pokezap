import { Pokemon, RaidPokemon, Skill } from '@prisma/client'
import { typeEffectivenessMap } from '../constants/atkEffectivenessMap'
import { PokemonBaseData, RaidPokemonBaseData } from '../modules/duel/duelNXN'

export function getBestSkillSet(
  map: Map<number, Skill>,
  attacker: Pokemon | RaidPokemon,
  defenderTeam: PokemonBaseData[] | RaidPokemonBaseData[]
): Map<string, Skill & { processedAttackPower: number }> {
  const skillMap = new Map<string, Skill & { preProcessedPower: number }>([])

  for (const [power, skill] of map) {
    const skillInMap = skillMap.get(skill.typeName)
    if (!skillInMap || skillInMap.preProcessedPower < power) {
      skillMap.set(skill.typeName, { ...skill, preProcessedPower: power })
    }
  }

  const finalSkillMap = new Map<string, Skill & { processedAttackPower: number }>([])

  for (const defender of defenderTeam) {
    if (finalSkillMap.get(defender.baseData.name)) continue
    const patkPowerSkills: [number, Skill][] = []
    for (const [, skill] of skillMap) {
      // calculate the damage this skill does to the enemy
      patkPowerSkills.push(calculateDamageAgainstPokemonX(attacker, defender, skill))
    }

    const strongerSkillAgainstDefender = patkPowerSkills.reduce((max, curr) => {
      if (curr[0] > max[0]) {
        return curr
      }
      return max
    })

    finalSkillMap.set(defender.baseData.name, {
      ...strongerSkillAgainstDefender[1],
      processedAttackPower: strongerSkillAgainstDefender[0],
    })
  }

  return finalSkillMap
}

const calculateDamageAgainstPokemonX = (
  attacker: Pokemon | RaidPokemon,
  defender: PokemonBaseData | RaidPokemonBaseData,
  skill: Skill & { preProcessedPower: number }
): [number, Skill] => {
  const adRatio = () => {
    if (skill.isPhysical) return attacker.atk / defender.def
    return attacker.spAtk / defender.spDef
  }

  const efMultiplier = getAttackEffectivenessMultiplier(
    skill.typeName,
    defender.baseData.type1Name,
    defender.baseData.type2Name
  )

  const processedAttackPower =
    (((attacker.level * 0.4 + 2) * skill.preProcessedPower * adRatio()) / 50 + 2) * efMultiplier

  return [processedAttackPower, skill]
}

const getAttackEffectivenessMultiplier = (atkType: string, defType1: string, defType2?: string | null) => {
  const effectivenessData = typeEffectivenessMap.get(atkType)
  const getFactor = (type: string, efData: any) => {
    if (efData.effective.includes(type)) return 2
    if (efData.ineffective.includes(type)) return 0.5
    if (efData.noDamage.includes(type)) return 'no-damage'
    return 1
  }

  const factor1 = getFactor(defType1, effectivenessData)
  const factor2 = getFactor(defType2 || 'notype', effectivenessData)

  if (factor1 === 'no-damage' || factor2 === 'no-damage') return 0.25
  return factor1 * factor2
}
