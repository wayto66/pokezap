import prisma from '../../../../../prisma-provider/src'
import { UnexpectedError } from '../../../infra/errors/AppErrors'
import { logger } from '../../../infra/logger'
import { BasePokemon, GameRoom, Player, Pokemon } from '../../../types/prisma'

type TParams = {
  pokemon: Pokemon
  targetPokemon: Pokemon & {
    baseData: BasePokemon
  }
  bonusExpMultiplier?: number
  route: GameRoom & {
    players: Player[]
  }
}

type TResponse = {
  route: GameRoom & {
    players: Player[]
  }
  leveledUp: boolean
}

export const handleRouteExperienceGain = async (data: TParams): Promise<TResponse> => {
  const { route } = data
  const expGain = getExperienceGain(data)
  const newExp = Math.round(route.experience + expGain / 7)
  const newLevel = Math.floor(Math.cbrt(newExp))

  const updatedRoute = await prisma.gameRoom
    .update({
      where: {
        id: route.id,
      },
      data: {
        experience: newExp,
        level: newLevel,
      },
      include: {
        players: true,
      },
    })
    .catch(e => {
      logger.error(e)
      throw new UnexpectedError('handleExperienceGain')
    })

  return {
    route: updatedRoute,
    leveledUp: newLevel !== route.level,
  }
}

const getExperienceGain = (data: TParams) => {
  const { targetPokemon, bonusExpMultiplier, route } = data

  const b = targetPokemon.baseData.BaseExperience
  const L = targetPokemon.level
  const a = targetPokemon.ownerId === null ? 1 : 1.5
  const e = bonusExpMultiplier ? 1 + bonusExpMultiplier : 1
  const t = 1
  const lowPopulatedRoomHandicap = 2 / route.players.length
  const highLevelPenalty = ((100 - route.level) / 100) ** 0.5 * 0.95 - Math.max(0, (route.level - 50) / 1100)

  return Math.round(((b * L) / 7) * e * a * t * lowPopulatedRoomHandicap * highLevelPenalty)
}
