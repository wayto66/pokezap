import { PrismaClient } from '@prisma/client'
import { UnexpectedError } from 'infra/errors/AppErrors'
import { container } from 'tsyringe'
import { talentNameMap } from '../../../constants/talentNameMap'
import { getRandomBetween2 } from '../../../helpers/getRandomBetween2'
import { generateGeneralStats } from '../generateGeneralStats'
import { generateHpStat } from '../generateHpStat'

type TParams = {
  name: string
  level: number
  shinyChance: number
  gameRoomId: number
  raidId: number
}

export const generateMegaPokemon = async (data: TParams) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const { name, level, shinyChance, gameRoomId } = data

  const baseData = await prismaClient.basePokemon.findFirst({
    where: {
      name,
    },
  })

  if (!baseData) throw new UnexpectedError('No basePokemon found for ' + name)

  const isShiny = Math.random() < shinyChance
  const talentIds = [
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
        gameRoomId,
        savage: false,
        level: level,
        experience: level ** 3,
        isMale: Math.random() > 0.5,
        isShiny: true,
        spriteUrl: baseData.shinySpriteUrl,
        hp: Math.round(generateHpStat(baseData.BaseHp, level) * 1.1),
        atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * 1.1),
        def: Math.round(generateGeneralStats(baseData.BaseDef, level) * 1.1),
        spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * 1.1),
        spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * 1.1),
        speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * 1.1),
        isAdult: true,
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
      gameRoomId,
      savage: false,
      level: level,
      experience: level ** 3,
      isMale: Math.random() > 0.5,
      spriteUrl: baseData.defaultSpriteUrl,
      hp: generateHpStat(baseData.BaseHp, level),
      atk: generateGeneralStats(baseData.BaseAtk, level),
      def: generateGeneralStats(baseData.BaseDef, level),
      spAtk: generateGeneralStats(baseData.BaseSpAtk, level),
      spDef: generateGeneralStats(baseData.BaseSpDef, level),
      speed: generateGeneralStats(baseData.BaseSpeed, level),
      isAdult: true,
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
