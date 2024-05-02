import { BasePokemon, Pokemon } from '@prisma/client'

export type DuelPokemonExtra = Pokemon & {
  baseData: BasePokemon
  manaBonus?: number | undefined
  lifeSteal?: number | undefined
  critChance?: number | undefined
  blockChance?: number | undefined
  crescentBonuses?: {
    block?: number
    damage?: number
  }
  statusCleanseChance?: number
  healingBonus?: number
  buffBonus?: number
}

type TParams = {
  poke: DuelPokemonExtra
  team:
    | (
        | (Pokemon & {
            baseData: BasePokemon
          })
        | null
      )[]
    | undefined
}

export const getTeamBonuses = async (data: TParams): Promise<DuelPokemonExtra> => {
  const { poke, team } = data
  const updatedPoke = { ...poke }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('flying') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('dragon')
    )
  ) {
    updatedPoke.speed = poke.speed * 1.2
    updatedPoke.crescentBonuses = {
      block: 0.02,
    }
    console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated wingeon buff.`)
    return updatedPoke
  }
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('fire') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('ground')
    )
  ) {
    updatedPoke.critChance = 0.2
    console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated volcanic buff.`)
    return updatedPoke
  }
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('psychic') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('ghost') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('dark')
    )
  ) {
    updatedPoke.manaBonus = 20
    console.log(
      `${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated mastermind buff.`
    )
    return updatedPoke
  }
  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('electric') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('rock') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('steel')
    )
  ) {
    updatedPoke.def = updatedPoke.def * 1.2
    updatedPoke.spDef = updatedPoke.def * 1.2
    // provisory:
    updatedPoke.hp = updatedPoke.hp * 1.2
    console.log(
      `${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated thunderforge buff.`
    )
    return updatedPoke
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('fairy') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('grass')
    )
  ) {
    updatedPoke.def = updatedPoke.def * 1.2
    updatedPoke.spDef = updatedPoke.def * 1.2
    // provisory:
    updatedPoke.hp = updatedPoke.hp * 1.2
    console.log(
      `${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated wonderleaf buff.`
    )
    return updatedPoke
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('poison') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('bug')
    )
  ) {
    updatedPoke.lifeSteal = 0.2
    console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated toxibug buff.`)
    return updatedPoke
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('normal') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('fighting')
    )
  ) {
    updatedPoke.lifeSteal = 0.2
    console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated toxibug buff.`)
    return updatedPoke
  }

  if (
    team?.every(
      poke =>
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('water') ||
        [poke?.baseData.type1Name, poke?.baseData.type2Name].includes('ice')
    )
  ) {
    updatedPoke.hp = updatedPoke.hp * 1.2
    console.log(`${updatedPoke.baseData.name} from player ${updatedPoke.ownerId || 'unknown'} activated seavell buff.`)
    return updatedPoke
  }

  return updatedPoke
}
