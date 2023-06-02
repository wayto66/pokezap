import { BasePokemon, Pokemon } from '@prisma/client'

export type DuelPokemonExtra = Pokemon & {
  baseData: BasePokemon
  manaBonus?: number | undefined
  lifeSteal?: number | undefined
  critChance?: number | undefined
  blockChance?: number | undefined
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
  const { poke } = data

  const updatedPoke = { ...poke }
  updatedPoke.critChance = 0
  updatedPoke.lifeSteal = 0.1

  return updatedPoke
}
