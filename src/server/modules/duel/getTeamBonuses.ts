import { BasePokemon, Pokemon } from '@prisma/client'

type duelPokemon = Pokemon & {
  baseData: BasePokemon
  manaBonus?: number | undefined
  lifeSteal?: number | undefined
  critChance?: number | undefined
  blockChance?: number | undefined
}

type TParams = {
  poke: duelPokemon
  team: duelPokemon[] | undefined
}

export const getTeamBonuses = async (data: TParams): Promise<duelPokemon> => {
  const { poke, team } = data

  const updatedPoke = { ...poke }
  updatedPoke.critChance = 0
  updatedPoke.lifeSteal = 0.1

  return updatedPoke
}
