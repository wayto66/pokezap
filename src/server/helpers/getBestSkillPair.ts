export function getBestSkillPair(map: Map<number, any>): [number, any][] | undefined[] {
  let ultimatePower: number | undefined
  let ultimateSkill: [number, any] | undefined
  let basicPower: number | undefined
  let basicSkill: [number, any] | undefined

  for (const [power, skills] of map) {
    const currentSkill = skills[0]

    if (currentSkill.attackPower > 100 && (!ultimatePower || power > ultimatePower)) {
      ultimatePower = power
      ultimateSkill = [power, skills[0]]
    }
    if (currentSkill.attackPower < 100 && (!basicPower || power > basicPower)) {
      basicPower = power
      basicSkill = [power, currentSkill]
    }
  }

  if (!ultimateSkill && !basicSkill) return []

  if (!ultimateSkill) {
    ultimateSkill = basicSkill
  } else if (basicSkill && ultimateSkill[0] < basicSkill[0]) {
    ultimateSkill = basicSkill
  }

  return [basicSkill!, ultimateSkill!]
}
