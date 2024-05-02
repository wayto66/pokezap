import prisma from '../../../../../../prisma-provider/src'
import { UnexpectedError } from '../../../../infra/errors/AppErrors'
import { RaidPokemonBaseDataSkills } from '../../../../types'
import { talentNameMap } from '../../../constants/talentNameMap'
import { getRandomBetween2 } from '../../../helpers/getRandomBetween2'
import { generateGeneralStats } from '../generateGeneralStats'
import { generateHpStat } from '../generateHpStat'

type TParams = {
  name: string
  level: number
  shinyChance: number
}

export const generateMegaPokemon = async (data: TParams): Promise<RaidPokemonBaseDataSkills> => {
  const { name, level, shinyChance } = data

  const baseData = await prisma.basePokemon.findFirst({
    where: {
      name,
    },
  })

  if (!baseData) throw new UnexpectedError('No basePokemon found for ' + name)

  const isShiny = Math.random() < shinyChance

  const random1 = Math.max(Math.ceil(Math.random() * 18), 1)
  const random2 = Math.max(Math.ceil(Math.random() * 18), 1)
  const random3 = Math.max(Math.ceil(Math.random() * 18), 1)

  const talentIds = [random1, random1, random1, random2, random2, random2, random3, random3, random3]

  if (isShiny) {
    const talentId1 = talentNameMap.get(baseData.type1Name)
    const talentId2 = talentNameMap.get(baseData.type2Name || baseData.type1Name)
    return await prisma.raidPokemon.create({
      data: {
        basePokemonId: baseData.id,
        level: level,
        isShiny: true,
        spriteUrl: baseData.shinySpriteUrl,
        hp: Math.round(generateHpStat(baseData.BaseHp, level) * 1.2),
        atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * 1.2),
        def: Math.round(generateGeneralStats(baseData.BaseDef, level) * 1.2),
        spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * 1.2),
        spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * 1.2),
        speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * 1.2),
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

  return await prisma.raidPokemon.create({
    data: {
      basePokemonId: baseData.id,
      level: level,
      spriteUrl: baseData.defaultSpriteUrl,
      hp: Math.round(generateHpStat(baseData.BaseHp, level) * 1.1),
      atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * 1.1),
      def: Math.round(generateGeneralStats(baseData.BaseDef, level) * 1.1),
      spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * 1.1),
      spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * 1.1),
      speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * 1.1),
      talentId1: talentIds[0],
      talentId2: talentIds[1],
      talentId3: talentIds[2],
      talentId4: talentIds[3],
      talentId5: talentIds[4],
      talentId6: talentIds[5],
      talentId7: talentIds[6],
      talentId8: talentIds[7],
      talentId9: talentIds[8],
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
