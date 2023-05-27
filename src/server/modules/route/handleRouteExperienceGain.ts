import { BasePokemon, GameRoom, Pokemon, PrismaClient } from '@prisma/client'
import { UnexpectedError } from '../../../infra/errors/AppErrors'
import { container } from 'tsyringe'

type TParams = {
  pokemon: Pokemon
  targetPokemon: Pokemon & {
    baseData: BasePokemon
  }
  bonusExpMultiplier?: number
  route: GameRoom
}

type TResponse = {
  route: GameRoom
  leveledUp: boolean
}

export const handleRouteExperienceGain = async (data: TParams): Promise<TResponse> => {
  console.log('start hecpg')
  const { pokemon, targetPokemon, route } = data
  const expGain = getExperienceGain(data)
  const newExp = Math.round(route.experience + expGain / 5)
  const newLevel = Math.floor(Math.cbrt(newExp))

  const prisma = container.resolve<PrismaClient>('PrismaClient')

  console.log('trying to update exp')
  console.log({ newExp, newLevel, id: pokemon.id })

  const updatedRoute = await prisma.gameRoom
    .update({
      where: {
        id: route.id,
      },
      data: {
        experience: newExp,
        level: newLevel,
      },
    })
    .catch(e => {
      console.error(e)
      throw new UnexpectedError('handleExperienceGain')
    })

  return {
    route: updatedRoute,
    leveledUp: newLevel !== route.level,
  }
}

const getExperienceGain = (data: TParams) => {
  const { pokemon, targetPokemon, bonusExpMultiplier } = data

  const b = targetPokemon.baseData.BaseExperience
  const L = targetPokemon.level
  const a = targetPokemon.ownerId === null ? 1 : 1.5
  const e = bonusExpMultiplier ? 1 + bonusExpMultiplier : 1
  const t = 1

  return Math.round(((b * L) / 7) * e * a * t)
}
