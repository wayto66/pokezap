import { GymPokemon } from '@prisma/client'

import { UnexpectedError } from '../../../../infra/errors/AppErrors'
import { talentNameMap } from '../../../constants/talentNameMap'
import { getRandomBetween2 } from '../../../helpers/getRandomBetween2'
import { generateGeneralStats } from '../generateGeneralStats'
import { generateHpStat } from '../generateHpStat'
prisma

type TParams = {
  name: string
  level: number
  ownerId: number
}

export const generateGymPokemons = async (data: TParams): Promise<GymPokemon> => {
  const { name, level, ownerId } = data

  const baseData = await prisma.basePokemon.findFirst({
    where: {
      name,
    },
  })

  if (!baseData) throw new UnexpectedError('No basePokemon found for : ' + name)

  const talentId1 = talentNameMap.get(baseData.type1Name)
  const talentId2 = talentNameMap.get(baseData.type2Name || baseData.type1Name)
  return await prisma.gymPokemon.create({
    data: {
      basePokemonName: baseData.name,
      ownerId,
      level: level,
      isShiny: true,
      spriteUrl: baseData.shinySpriteUrl,
      hp: Math.round(generateHpStat(baseData.BaseHp, level) * 1.15),
      atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * 1.15),
      def: Math.round(generateGeneralStats(baseData.BaseDef, level) * 1.15),
      spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * 1.15),
      spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * 1.15),
      speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * 1.15),
      talentId1: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId2: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId3: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId4: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId5: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId6: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId7: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId8: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
      talentId9: getRandomBetween2({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
    },
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  })
}
