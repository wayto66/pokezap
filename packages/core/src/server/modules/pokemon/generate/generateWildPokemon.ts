import prisma from '../../../../../../prisma-provider/src'
import { UnexpectedError } from '../../../../infra/errors/AppErrors'
import { talentNameMap } from '../../../../server/constants/talentNameMap'
import { BasePokemon, Skill } from '../../../../types/prisma'
import { generateGeneralStats } from '../generateGeneralStats'
import { generateHpStat } from '../generateHpStat'

type TParams = {
  baseData: BasePokemon & {
    skills: Skill[]
  }
  level: number
  shinyChance: number
  savage: boolean
  isAdult: boolean
  talentIds?: number[]
  gameRoomId?: number
  fromIncense?: boolean
}

export const generateWildPokemon = async (data: TParams) => {
  const { baseData, level, shinyChance, savage, isAdult, gameRoomId } = data

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

  const regionalMultiplier = baseData.isRegional ? 1.05 : 1

  if (isShiny) {
    const getTalentPossibilites = (baseData: BasePokemon & { skills: Skill[] }) => {
      return baseData.skills.map(skill => {
        if (skill.attackPower <= 40)
          return {
            type: skill.typeName,
            reqCount: 1,
          }
        if (skill.attackPower <= 80)
          return {
            type: skill.typeName,
            reqCount: 2,
          }
        return {
          type: skill.typeName,
          reqCount: 3,
        }
      })
    }

    const possibleTalents = getTalentPossibilites(baseData)

    let availableTalentSlots = 9
    const talents: { reqCount: number; type: string }[] = []
    const finalTalentIds: number[] = []

    if (baseData.type1Name) {
      talents.push({
        reqCount: 3,
        type: baseData.type1Name,
      })
      availableTalentSlots -= 3
    }

    if (baseData.type2Name) {
      talents.push({
        reqCount: 3,
        type: baseData.type2Name,
      })
      availableTalentSlots -= 3
    }

    for (const talent of talents) {
      const talentId = talentNameMap.get(talent.type)
      if (!talentId) throw new UnexpectedError('Unabled to find talent id for type ' + talent.type)
      for (let i = 0; i < talent.reqCount; i++) {
        finalTalentIds.push(talentId)
      }
    }
    while (finalTalentIds.length < 9) {
      const newTalent = possibleTalents[Math.floor(Math.random() * possibleTalents.length)]
      const talentId = talentNameMap.get(newTalent.type)
      if (!talentId) throw new UnexpectedError('Unabled to find talent id for type ' + newTalent.type)
      for (let i = 0; i < 3; i++) {
        finalTalentIds.push(talentId)
      }
      availableTalentSlots -= 3
    }

    return await prisma.pokemon.create({
      data: {
        basePokemonId: baseData.id,
        gameRoomId,
        savage: savage,
        level: level,
        experience: level ** 3,
        isMale: Math.random() > 0.5,
        isShiny: true,
        isGiant: Math.random() < 0.1,
        spriteUrl: baseData.shinySpriteUrl,
        hp: Math.round(generateHpStat(baseData.BaseHp, level) * 1.15 * regionalMultiplier),
        atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * 1.15 * regionalMultiplier),
        def: Math.round(generateGeneralStats(baseData.BaseDef, level) * 1.15 * regionalMultiplier),
        spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * 1.15 * regionalMultiplier),
        spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * 1.15 * regionalMultiplier),
        speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * 1.15 * regionalMultiplier),
        isAdult: isAdult,
        talentId1: finalTalentIds[0],
        talentId2: finalTalentIds[1],
        talentId3: finalTalentIds[2],
        talentId4: finalTalentIds[3],
        talentId5: finalTalentIds[4],
        talentId6: finalTalentIds[5],
        talentId7: finalTalentIds[6],
        talentId8: finalTalentIds[7],
        talentId9: finalTalentIds[8],
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

  return await prisma.pokemon.create({
    data: {
      basePokemonId: baseData.id,
      gameRoomId,
      savage: savage,
      level: level,
      isGiant: Math.random() < 0.1,
      experience: level ** 3,
      isMale: Math.random() > 0.5,
      spriteUrl: baseData.defaultSpriteUrl,
      hp: Math.round(generateHpStat(baseData.BaseHp, level) * regionalMultiplier),
      atk: Math.round(generateGeneralStats(baseData.BaseAtk, level) * regionalMultiplier),
      def: Math.round(generateGeneralStats(baseData.BaseDef, level) * regionalMultiplier),
      spAtk: Math.round(generateGeneralStats(baseData.BaseSpAtk, level) * regionalMultiplier),
      spDef: Math.round(generateGeneralStats(baseData.BaseSpDef, level) * regionalMultiplier),
      speed: Math.round(generateGeneralStats(baseData.BaseSpeed, level) * regionalMultiplier),
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
