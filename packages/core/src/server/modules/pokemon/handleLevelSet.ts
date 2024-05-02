import prisma from '../../../../../prisma-provider/src'
import { PokemonNotFoundError, UnexpectedError } from '../../../infra/errors/AppErrors'
import { logger } from '../../../infra/logger'
import { PokemonBaseData } from '../../../types'
import { BasePokemon, Pokemon } from '../../../types/prisma'

import { generateGeneralStats } from './generateGeneralStats'
import { generateHpStat } from './generateHpStat'

type TParams = {
  pokemon: PokemonBaseData
  targetLevel: number
  removeFromDaycare?: boolean
}

type TResponse = {
  pokemon: Pokemon & {
    baseData: BasePokemon
  }
  leveledUp: boolean
}

export const handleLevelSet = async (data: TParams): Promise<TResponse> => {
  const { targetLevel } = data

  const pokemon = await prisma.pokemon.findFirst({
    where: {
      id: data.pokemon.id,
    },
    include: {
      baseData: true,
    },
  })

  if (!pokemon) throw new PokemonNotFoundError(data.pokemon.id)

  const updatedPokemon = await prisma.pokemon
    .update({
      where: {
        id: pokemon.id,
      },
      data: {
        experience: targetLevel ** 3,
        level: targetLevel,
        hp: generateHpStat(pokemon.baseData.BaseHp, targetLevel),
        atk: generateGeneralStats(pokemon.baseData.BaseAtk, targetLevel),
        def: generateGeneralStats(pokemon.baseData.BaseDef, targetLevel),
        spAtk: generateGeneralStats(pokemon.baseData.BaseSpAtk, targetLevel),
        spDef: generateGeneralStats(pokemon.baseData.BaseSpDef, targetLevel),
        speed: generateGeneralStats(pokemon.baseData.BaseSpeed, targetLevel),
        isInDaycare: !data.removeFromDaycare,
      },
      include: {
        baseData: true,
      },
    })
    .catch(e => {
      logger.error(e)
      throw new UnexpectedError('handleExperienceGain')
    })

  return {
    pokemon: updatedPokemon,
    leveledUp: true,
  }
}
