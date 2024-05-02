export const generateGeneralStats = (stat: number, level: number) => {
  return Math.ceil((((2 * stat + 31 + 252 / 4) * level) / 100 + 5) * (Math.random() * 0.2 + 0.9))
}
