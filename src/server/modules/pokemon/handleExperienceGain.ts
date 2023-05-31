import { BasePokemon, Pokemon, PrismaClient } from '@prisma/client'
import { PokemonNotFoundError, UnexpectedError } from '../../../infra/errors/AppErrors'
import { container } from 'tsyringe'
import { generateHpStat } from './generateHpStat'
import { generateGeneralStats } from './generateGeneralStats'

type TParams = {
  pokemon: Pokemon
  targetPokemon: Pokemon & {
    baseData: BasePokemon
  }
  bonusExp?: number
}

type TResponse = {
  pokemon: Pokemon & {
    baseData: BasePokemon
  }
  leveledUp: boolean
}

export const handleExperienceGain = async (data: TParams): Promise<TResponse> => {

  const expGain = getExperienceGain(data)
  const newExp = data.pokemon.experience + expGain
  const newLevel = Math.floor(Math.cbrt(newExp))

  const prisma = container.resolve<PrismaClient>('PrismaClient')

  const pokemon = await prisma.pokemon.findFirst({
    where: {
      id: data.pokemon.id,
    },
    include: {
      baseData: true,
    },
  })

  if (!pokemon) throw new PokemonNotFoundError(data.pokemon.id)

  console.log({ newExp, newLevel, id: pokemon.id })

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
      console.error(e)
      throw new UnexpectedError('handleExperienceGain')
    })

  return {
    pokemon: updatedPokemon,
    leveledUp: newLevel !== pokemon.level,
  }
}

const getExperienceGain = (data: TParams) => {
  const { targetPokemon, bonusExp } = data

  const b = targetPokemon.baseData.BaseExperience
  const L = targetPokemon.level
  const a = targetPokemon.ownerId === null ? 1 : 1.5
  const e = bonusExp ? 1 + bonusExp : 1
  const t = 1

  return Math.round(((b * L) / 7) * e * a * t)
}
