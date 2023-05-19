import { PrismaClient } from "@prisma/client"
import { container } from "tsyringe"
import { evoDataIdMap } from "../../../server/constants/evoDataIdMap"
import { getRandomBetween2 } from "../../../server/helpers/getRandomBetween2"
import { getRandomBetween3 } from "../../../server/helpers/getRandomBetween3"
import { IPokemon } from "../../../server/models/IPokemon"

type TParams = {
  poke1: IPokemon
  poke2: IPokemon
}

export const breed = async (data: TParams): Promise<IPokemon | string> => {
  const prismaClient = container.resolve<PrismaClient>("PrismaClient")

  const babyId1 = evoDataIdMap.get(data.poke1.baseData.id)
  const babyId2 = evoDataIdMap.get(data.poke2.baseData.id)

  const babyBaseDataId = await getRandomBetween2({
    obj1: [babyId1, 0.5],
    obj2: [babyId2, 0.5],
  })

  if (!babyBaseDataId) return "ERROR: Failed to find babyBaseDataId."

  const babyBaseData = await prismaClient.basePokemon.findFirst({
    where: {
      id: babyBaseDataId,
    },
  })

  if (!babyBaseData) return "ERROR: Failed to find babyBaseData."

  const babyPoke = await prismaClient.pokemon.create({
    data: {
      basePokemonId: babyBaseDataId,
      atk: Math.round(babyBaseData.BaseAtk * (0.8 + Math.random() * 0.4)),
      def: Math.round(babyBaseData.BaseDef * (0.8 + Math.random() * 0.4)),
      hp: Math.round(babyBaseData.BaseHp * (0.8 + Math.random() * 0.4)),
      spAtk: Math.round(babyBaseData.BaseSpAtk * (0.8 + Math.random() * 0.4)),
      spDef: Math.round(babyBaseData.BaseSpDef * (0.8 + Math.random() * 0.4)),
      speed: Math.round(babyBaseData.BaseSpeed * (0.8 + Math.random() * 0.4)),
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

  if (!babyPoke) return "ERROR: Failed to create babyPoke."

  return babyPoke
}
