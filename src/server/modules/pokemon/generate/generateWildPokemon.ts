import { BasePokemon, PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { generateHpStat } from '../generateHpStat'
import { generateGeneralStats } from '../generateGeneralStats'
import { talentNameMap } from '../../../../server/constants/talentNameMap'
import { getRandomBetween2 } from '../../../../server/helpers/getRandomBetween2'

type TParams = {
  baseData: BasePokemon
  level: number
  shinyChance: number
  savage: boolean
  isAdult: boolean
  talentIds?: number[]
}

export const generateWildPokemon = async (data: TParams) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const { baseData, level, shinyChance, savage, isAdult } = data

  const isShiny = Math.random() < shinyChance
  const talentIds = data.talentIds
    ? data.talentIds
    : [
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
        Math.max(Math.ceil(Math.random() * 18), 1),
      ]

  if (isShiny) {
    const talentId1 = talentNameMap.get(baseData.type1Name)
    const talentId2 = talentNameMap.get(baseData.type2Name || baseData.type1Name)
    return await prismaClient.pokemon.create({
      data: {
        basePokemonId: baseData.id,
        savage: savage,
        level: level,
        isMale: Math.random() > 0.5,
        isShiny: true,
        spriteUrl: baseData.shinySpriteUrl,
        hp: Math.round(generateHpStat(baseData.BaseHp, level) * 1.1),
        atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * 1.1),
        def: Math.round(generateGeneralStats(baseData.BaseDef, level) * 1.1),
        spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * 1.1),
        spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * 1.1),
        speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * 1.1),
        isAdult: isAdult,
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
        baseData: true,
        talent1: true,
        talent2: true,
        talent3: true,
        talent4: true,
        talent5: true,
        talent6: true,
        talent7: true,
        talent8: true,
        talent9: true,
      },
    })
  }

  return await prismaClient.pokemon.create({
    data: {
      basePokemonId: baseData.id,
      savage: savage,
      level: level,
      isMale: Math.random() > 0.5,
      spriteUrl: baseData.defaultSpriteUrl,
      hp: generateHpStat(baseData.BaseHp, level),
      atk: generateGeneralStats(baseData.BaseAtk, level),
      def: generateGeneralStats(baseData.BaseDef, level),
      spAtk: generateGeneralStats(baseData.BaseSpAtk, level),
      spDef: generateGeneralStats(baseData.BaseSpDef, level),
      speed: generateGeneralStats(baseData.BaseSpeed, level),
      isAdult: isAdult,
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
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
    },
  })
}
