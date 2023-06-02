export function getBestSkillPairX2(map: Map<number[], any>): [number[], any][] | undefined[] {
  let ultimatePower0 = 0
  let ultimatePower1 = 0
  let ultimateSkill: [number[], any] | undefined
  let basicPower0 = 0
  let basicPower1 = 0
  let basicSkill: [number[], any] | undefined

  for (const [[power0, power1], skill] of map) {
    if (skill.attackPower > 100 && power0 + power1 > ultimatePower0 + ultimatePower1) {
      ultimatePower0 = power0
      ultimatePower1 = power1
      ultimateSkill = [[power0, power1], skill]
    }
    if (skill.attackPower < 100 && power0 + power1 > basicPower0 + basicPower1) {
      basicPower0 = power0
      basicPower1 = power1
      basicSkill = [[power0, power1], skill]
    }
  }

  if (!ultimateSkill && !basicSkill) return []

  if (!ultimateSkill) {
    ultimateSkill = basicSkill
  } else if (basicSkill && ultimatePower0 + ultimatePower1 < basicPower0 + basicPower1) {
    ultimateSkill = basicSkill
  }

  return [basicSkill!, ultimateSkill!]
}
