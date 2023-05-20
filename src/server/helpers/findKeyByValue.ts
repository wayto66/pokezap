export function findKeyByValue(map: Map<number, any>, value: any): number | undefined {
  for (const [key, val] of map) {
    if (val === value) {
      return key
    }
  }
  return undefined
}
