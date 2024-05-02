type TParams = {
  obj1: [value: any, weight: number]

  obj2: [value: any, weight: number]

  obj3: [value: any, weight: number]
}

export const getRandomBetween3 = (data: TParams) => {
  if (data.obj1[1] + data.obj2[1] + data.obj3[1] > 1) return
  const random = Math.random()

  if (random < data.obj1[1]) {
    return data.obj1[0]
  }

  if (random < data.obj1[1] + data.obj2[1]) {
    return data.obj2[0]
  }

  return data.obj3[0]
}
