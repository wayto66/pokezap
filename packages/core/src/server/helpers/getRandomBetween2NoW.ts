export const getRandomBetween2NoW = (x: any, y: any) => {
  const random = Math.random()
  if (random < 0.5) return x
  return y
}
