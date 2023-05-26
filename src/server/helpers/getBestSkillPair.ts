export function getBestSkillPair(map: Map<number, any>): [number, any][] | undefined[] {
  let ultimatePower: number | undefined
  let ultimateSkill: [number, any] | undefined
  let basicPower: number | undefined
  let basicSkill: [number, any] | undefined

  for (const [power, skills] of map) {
    if (skills[0].attackPower > 100 && (ultimatePower === undefined || power > ultimatePower)) {
      ultimatePower = power
      ultimateSkill = [power, skills[0]]
    }
    if (skills[0].attackPower < 100 && (basicPower === undefined || power > basicPower)) {
      basicPower = power
      basicSkill = [power, skills[0]]
    }
  }

  if (!ultimateSkill && !basicSkill) return [,]

  if (!ultimateSkill) ultimateSkill = basicSkill

  if (ultimateSkill[0] < basicSkill[0]) ultimateSkill = basicSkill

  return [basicSkill, ultimateSkill]
}
