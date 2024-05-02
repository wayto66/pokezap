import { PokemonBaseData } from '../modules/duel/duelNXN'

export const getActiveClanBonus = (team: (PokemonBaseData | null)[]): string => {
  if (team.length < 6) return 'Nenhum'
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('flying') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('dragon')
    )
  ) {
    return 'Wingeon'
  }
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('fire') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('ground')
    )
  ) {
    return 'Volcanic'
  }
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('psychic') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('ghost') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('dark')
    )
  ) {
    return 'Mastermind'
  }
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('electric') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('rock') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('steel')
    )
  ) {
    return 'Thunderforge'
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('fairy') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('grass')
    )
  ) {
    return 'Wonderleaf'
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('poison') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('bug')
    )
  ) {
    return 'Toxibug'
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('normal') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('fighting')
    )
  ) {
    return 'Gardestrike'
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('water') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('ice')
    )
  ) {
    return 'Seavell'
  }

  return 'Nenhum'
}
