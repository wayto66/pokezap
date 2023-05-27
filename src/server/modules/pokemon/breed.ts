import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { evoDataIdMap } from '../../../server/constants/evoDataIdMap'
import { getRandomBetween2 } from '../../../server/helpers/getRandomBetween2'
import { getRandomBetween3 } from '../../../server/helpers/getRandomBetween3'
import { IPokemon } from '../../../server/models/IPokemon'
import { generateGeneralStats } from './generateGeneralStats'
import { generateHpStat } from './generateHpStat'
import { FailedToFindXinYError } from '../../../infra/errors/AppErrors'

type TParams = {
  poke1: IPokemon
  poke2: IPokemon
}

export const breed = async (data: TParams): Promise<IPokemon | string> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const babyId1 = evoDataIdMap.get(data.poke1.baseData.id)
  const babyId2 = evoDataIdMap.get(data.poke2.baseData.id)

  const babyBaseDataId = await getRandomBetween2({
    obj1: [babyId1, 0.5],
    obj2: [babyId2, 0.5],
  })

  if (!babyBaseDataId) throw new FailedToFindXinYError('babyBaseDataId', 'breed-module')

  const babyBaseData = await prismaClient.basePokemon.findFirst({
    where: {
      id: babyBaseDataId,
    },
  })

  if (!babyBaseData) throw new FailedToFindXinYError('babyBaseData', 'breed-module')

  const babyPoke = await prismaClient.pokemon.create({
    data: {
      basePokemonId: babyBaseDataId,
      hp: generateHpStat(babyBaseData.BaseHp, 1),
      atk: generateGeneralStats(babyBaseData.BaseAtk, 1),
      def: generateGeneralStats(babyBaseData.BaseDef, 1),
      spAtk: generateGeneralStats(babyBaseData.BaseSpAtk, 1),
      spDef: generateGeneralStats(babyBaseData.BaseSpDef, 1),
      speed: generateGeneralStats(babyBaseData.BaseSpeed, 1),
      isAdult: false,
      savage: false,
      isMale: Math.random() > 0.5,
      level: 1,
      ownerId: data.poke1.ownerId,
      parentId1: data.poke1.id,
      parentId2: data.poke2.id,
      talentId1: getRandomBetween3({
        obj1: [data.poke1.talentId1, 0.45],
        obj2: [data.poke2.talentId1, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId2: getRandomBetween3({
        obj1: [data.poke1.talentId2, 0.45],
        obj2: [data.poke2.talentId2, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId3: getRandomBetween3({
        obj1: [data.poke1.talentId3, 0.45],
        obj2: [data.poke2.talentId3, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId4: getRandomBetween3({
        obj1: [data.poke1.talentId4, 0.45],
        obj2: [data.poke2.talentId4, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId5: getRandomBetween3({
        obj1: [data.poke1.talentId5, 0.45],
        obj2: [data.poke2.talentId5, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId6: getRandomBetween3({
        obj1: [data.poke1.talentId6, 0.45],
        obj2: [data.poke2.talentId6, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId7: getRandomBetween3({
        obj1: [data.poke1.talentId7, 0.45],
        obj2: [data.poke2.talentId7, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId8: getRandomBetween3({
        obj1: [data.poke1.talentId8, 0.45],
        obj2: [data.poke2.talentId8, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
      talentId9: getRandomBetween3({
        obj1: [data.poke1.talentId9, 0.45],
        obj2: [data.poke2.talentId9, 0.45],
        obj3: [Math.ceil(Math.random() * 18), 0.1],
      }),
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

  return babyPoke
}
