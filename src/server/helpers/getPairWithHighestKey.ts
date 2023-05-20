export function getPairWithHighestKey(map: Map<number, any>): [number, any] | undefined {
  let highestKey: number | undefined
  let pairWithHighestKey: [number, any] | undefined

  for (const [key, value] of map) {
    if (highestKey === undefined || key > highestKey) {
      highestKey = key
      pairWithHighestKey = [key, value]
    }
  }

  return pairWithHighestKey
}
