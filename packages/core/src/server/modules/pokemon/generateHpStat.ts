export const generateHpStat = (baseHp: number, level: number) => {
  return Math.ceil(((2 * baseHp + 31 + 252 / 4) * level) / 100 + level + 10)
}
