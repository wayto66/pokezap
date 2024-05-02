import prisma from '../../../../../prisma-provider/src'
import { PokemonNotFoundError, UnexpectedError } from '../../../infra/errors/AppErrors'
import { logger } from '../../../infra/logger'
import { RaidPokemonBaseData } from '../../../types'
import { BasePokemon, Pokemon } from '../../../types/prisma'
import { generateGeneralStats } from './generateGeneralStats'
import { generateHpStat } from './generateHpStat'

type TParams = {
  pokemon: Pokemon
  targetPokemon:
    | (Pokemon & {
        baseData: BasePokemon
      })
    | RaidPokemonBaseData
  bonusExp?: number
  divide?: boolean
}

type TResponse = {
  pokemon: Pokemon & {
    baseData: BasePokemon
  }
  leveledUp: boolean
}

const experiencePenaltyByLevel = (level: number) => {
  if (level > 75) return 0.4
  if (level > 50) return 0.66
  return 1
}

export const handleExperienceGain = async (data: TParams): Promise<TResponse> => {
  const divideFactor = data.divide ? 0.5 : 1
  const expGain = Math.round(getExperienceGain(data) * divideFactor * experiencePenaltyByLevel(data.pokemon.level))
  const newExp = data.pokemon.experience + expGain
  const newLevel = Math.floor(Math.cbrt(newExp))

  const pokemon = await prisma.pokemon.findFirst({
    where: {
      id: data.pokemon.id,
    },
    include: {
      baseData: true,
    },
  })

  if (!pokemon) throw new PokemonNotFoundError(data.pokemon.id)

  if (pokemon.isShiny || pokemon.baseData.isRegional) {
    const multiplier = pokemon.isShiny ? 1.15 : 1.05

    const updatedPokemon = await prisma.pokemon
      .update({
        where: {
          id: pokemon.id,
        },
        data: {
          experience: newExp,
          level: newLevel,
          hp: Math.round(generateHpStat(pokemon.baseData.BaseHp, newLevel) * multiplier),
          atk: Math.round(generateGeneralStats(pokemon.baseData.BaseAtk, newLevel) * multiplier),
          def: Math.round(generateGeneralStats(pokemon.baseData.BaseDef, newLevel) * multiplier),
          spAtk: Math.round(generateGeneralStats(pokemon.baseData.BaseSpAtk, newLevel) * multiplier),
          spDef: Math.round(generateGeneralStats(pokemon.baseData.BaseSpDef, newLevel) * multiplier),
          speed: Math.round(generateGeneralStats(pokemon.baseData.BaseSpeed, newLevel) * multiplier),
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
      leveledUp: newLevel !== pokemon.level,
    }
  }

  const updatedPokemon = await prisma.pokemon
    .update({
      where: {
        id: pokemon.id,
      },
      data: {
        experience: newExp,
        level: newLevel,
        hp: generateHpStat(pokemon.baseData.BaseHp, newLevel),
        atk: generateGeneralStats(pokemon.baseData.BaseAtk, newLevel),
        def: generateGeneralStats(pokemon.baseData.BaseDef, newLevel),
        spAtk: generateGeneralStats(pokemon.baseData.BaseSpAtk, newLevel),
        spDef: generateGeneralStats(pokemon.baseData.BaseSpDef, newLevel),
        speed: generateGeneralStats(pokemon.baseData.BaseSpeed, newLevel),
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
    leveledUp: newLevel !== pokemon.level,
  }
}

const getExperienceGain = (data: TParams) => {
  const { targetPokemon, bonusExp, pokemon } = data

  const b = targetPokemon.baseData.BaseExperience
  const L = targetPokemon.level
  const a = 'ownerId' in targetPokemon ? 1 : 1.5
  const e = bonusExp ? 1 + bonusExp : 1
  const t = 1
  const highLevelPenalty = ((100 - pokemon.level) / 100) ** 0.5 * 0.95 - Math.max(0, (pokemon.level - 50) / 1100)

  return Math.round(((b * L) / 7) * e * a * t * highLevelPenalty)
}
