import { BaseItem, BasePokemon, HeldItem, Pokemon, PrismaClient, RaidPokemon, Skill } from '@prisma/client'
import { container } from 'tsyringe'
import { UnexpectedError } from '../../../infra/errors/AppErrors'
import { logger } from '../../../infra/logger'
import { defEffectivenessMap } from '../../constants/defEffectivenessMap'
import { plateTypeMap } from '../../constants/plateTypeMap'
import { talentIdMap } from '../../constants/talentIdMap'
import { findKeyByValue } from '../../helpers/findKeyByValue'
import { getBestSkillSet } from '../../helpers/getBestSkillSet'
import { TDuelRoundData, iGenDuel2X1Rounds } from '../imageGen/iGenDuel2X1Rounds'
import { iGenDuel3X1Rounds } from '../imageGen/iGenDuel3X1Rounds'
import { iGenDuel3X2Rounds } from '../imageGen/iGenDuel3X2Rounds'
import { iGenDuel3X3Rounds } from '../imageGen/iGenDuel3X3Rounds'
import { iGenDuel3X4Rounds } from '../imageGen/iGenDuel3X4Rounds'
import { iGenDuelRound } from '../imageGen/iGenDuelRound'
import { iGenDuelX2Rounds } from '../imageGen/iGenDuelX2Rounds'
import { DuelPokemonExtra, getTeamBonuses } from './getTeamBonuses'

export type RoundPokemonData = {
  name: string
  id: number
  ownerId?: number | null
  team: string
  spriteUrl: string
  type1: string
  type2: string | undefined | null
  level: number
  maxHp: number
  heldItemName: string | undefined
  hp: number
  speed: number
  skillMap: Map<string, Skill & { processedAttackPower: number }> | undefined
  currentSkillPower?: number
  currentSkillName?: string
  currentSkillType?: string
  crit: boolean
  block: boolean
  mana: number
  manaBonus: number
  lifeSteal: number
  critChance: number
  blockChance: number
  crescentBonuses?: {
    block?: number
    damage?: number
  }
  statusCleanseChance?: number
  healingBonus?: number
  buffBonus?: number
  role?: 'TANKER' | 'DAMAGE' | 'SUPPORT'
  behavior?: any
  totalDamageDealt: number
  totalHealing: number
}

export type DuelNxNRoundData = {
  leftTeamData: RoundPokemonData[]
  rightTeamData: RoundPokemonData[]
}

export type PokemonBaseData = Pokemon & {
  baseData: BasePokemon
}

export type RaidPokemonBaseData = RaidPokemon & {
  baseData: BasePokemon
}

export type PokemonBaseDataSkills = Pokemon & {
  baseData: BasePokemon & {
    skills: Skill[]
  }
}

export type PokemonBaseDataSkillsHeld = Pokemon & {
  baseData: BasePokemon & {
    skills: Skill[]
  }
  heldItem:
    | (HeldItem & {
        baseItem: BaseItem
      })
    | null
    | undefined
}

export type RaidPokemonBaseDataSkillsHeld = RaidPokemon & {
  baseData: BasePokemon & {
    skills: Skill[]
  }
  heldItem?:
    | (HeldItem & {
        baseItem: BaseItem
      })
    | null
    | undefined
}

export type RaidPokemonBaseDataSkills = RaidPokemon & {
  baseData: BasePokemon & {
    skills: Skill[]
  }
}

type TParams = {
  leftTeam: PokemonBaseDataSkillsHeld[]
  rightTeam: PokemonBaseDataSkillsHeld[] | RaidPokemonBaseDataSkillsHeld[]
  wildBattle?: true
  staticImage?: boolean
  returnOnlyPlayerPokemonDefeatedIds?: boolean
  backgroundTypeName?: string
}

export type TDuelNXNResponse = {
  winnerTeam: RoundPokemonData[]
  loserTeam: RoundPokemonData[]
  message: string
  isDraw: boolean
  imageUrl: string
  defeatedPokemonsIds?: number[]
  damageDealtMessage: string
}

export const duelNXN = async (data: TParams): Promise<TDuelNXNResponse | void> => {
  const prisma = container.resolve<PrismaClient>('PrismaClient')

  const { leftTeam, rightTeam } = data
  const leftPlayerIds = leftTeam.map(poke => {
    if (!poke.ownerId) throw new UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`)
    return poke.ownerId
  })
  const rightPlayerIds = rightTeam
    .map(poke => {
      if (!('ownerId' in poke)) return NaN
      if (!poke.ownerId && !data.wildBattle) throw new UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`)
      return Number(poke.ownerId)
    })
    .filter(id => id !== null && id !== undefined && !isNaN(id))

  const leftPlayersPokeTeamsData = await prisma.player.findMany({
    where: {
      id: {
        in: leftPlayerIds,
      },
    },
    include: {
      teamPoke1: {
        include: {
          baseData: true,
        },
      },
      teamPoke2: {
        include: {
          baseData: true,
        },
      },
      teamPoke3: {
        include: {
          baseData: true,
        },
      },
      teamPoke4: {
        include: {
          baseData: true,
        },
      },
      teamPoke5: {
        include: {
          baseData: true,
        },
      },
      teamPoke6: {
        include: {
          baseData: true,
        },
      },
    },
  })
  const rightPlayersPokeTeamsData =
    rightPlayerIds.length > 0
      ? await prisma.player.findMany({
          where: {
            id: {
              in: rightPlayerIds,
            },
          },
          include: {
            teamPoke1: {
              include: {
                baseData: true,
              },
            },
            teamPoke2: {
              include: {
                baseData: true,
              },
            },
            teamPoke3: {
              include: {
                baseData: true,
              },
            },
            teamPoke4: {
              include: {
                baseData: true,
              },
            },
            teamPoke5: {
              include: {
                baseData: true,
              },
            },
            teamPoke6: {
              include: {
                baseData: true,
              },
            },
          },
        })
      : []

  const leftPokesBonusesMap = new Map<number, DuelPokemonExtra>([])
  const rightPokesBonusesMap = new Map<number, DuelPokemonExtra>([])

  for (const poke of leftTeam) {
    const player = leftPlayersPokeTeamsData.find(player => player.id === poke.ownerId)
    if (!player) throw new UnexpectedError('player not found in duelNX1')
    leftPokesBonusesMap.set(
      poke.id,
      await getTeamBonuses({
        poke,
        team: [
          player.teamPoke1,
          player.teamPoke2,
          player.teamPoke3,
          player.teamPoke4,
          player.teamPoke5,
          player.teamPoke6,
        ],
      })
    )
  }

  if (!data.wildBattle)
    for (const poke of rightTeam) {
      if (!('ownerId' in poke)) continue
      const player = rightPlayersPokeTeamsData.find(player => player.id === poke.ownerId)
      if (!player) throw new UnexpectedError('player not found in duelNX1')
      rightPokesBonusesMap.set(
        poke.id,
        await getTeamBonuses({
          poke,
          team: [
            player.teamPoke1,
            player.teamPoke2,
            player.teamPoke3,
            player.teamPoke4,
            player.teamPoke5,
            player.teamPoke6,
          ],
        })
      )
    }

  const rightPokesSkillMap = new Map<number, Map<string, Skill & { processedAttackPower: number }> | undefined>([])
  const leftPokesSkillMap = new Map<number, Map<string, Skill & { processedAttackPower: number }> | undefined>([])

  for (const poke of leftTeam) {
    leftPokesSkillMap.set(
      poke.id,
      await getBestSkills({
        attacker: poke,
        defenders: rightTeam,
      })
    )
  }

  for (const poke of rightTeam) {
    rightPokesSkillMap.set(
      poke.id,
      await getBestSkills({
        attacker: poke,
        defenders: leftTeam,
      })
    )
  }

  const leftTeamData: RoundPokemonData[] = []
  const rightTeamData: RoundPokemonData[] = []

  for (const poke of leftTeam) {
    if (!poke.ownerId) throw new UnexpectedError(`Owner id not found for #${poke.id} in duelNX1.`)
    const pokeSkill = leftPokesSkillMap.get(poke.id)
    const pokeBonusData = leftPokesBonusesMap.get(poke.id)
    leftTeamData.push({
      name: poke.baseData.name,
      id: poke.id,
      ownerId: poke.ownerId,
      heldItemName: poke.heldItem?.baseItem.name || undefined,
      team: 'left',
      spriteUrl: poke.spriteUrl,
      type1: poke.baseData.type1Name,
      type2: poke.baseData.type2Name,
      level: poke.level,
      maxHp: 18 * poke.hp,
      hp: 18 * poke.hp,
      speed: poke.speed,
      skillMap: pokeSkill,
      crit: false,
      block: false,
      mana: 0,
      manaBonus: pokeBonusData?.manaBonus || 0,
      lifeSteal: pokeBonusData?.lifeSteal || 0,
      critChance: pokeBonusData?.critChance || 0,
      blockChance: pokeBonusData?.blockChance || 0,
      crescentBonuses: pokeBonusData?.crescentBonuses,
      statusCleanseChance: pokeBonusData?.statusCleanseChance,
      healingBonus: pokeBonusData?.healingBonus,
      buffBonus: pokeBonusData?.buffBonus,
      totalDamageDealt: 0,
      totalHealing: 0,
    })
  }
  for (const poke of rightTeam) {
    const pokeSkill = rightPokesSkillMap.get(poke.id)
    const pokeBonusData = rightPokesBonusesMap.get(poke.id)
    rightTeamData.push({
      name: poke.baseData.name,
      id: poke.id,
      ownerId: 'ownerId' in poke ? poke.ownerId : undefined,
      heldItemName: poke.heldItem?.baseItem.name || undefined,
      team: 'right',
      spriteUrl: poke.spriteUrl,
      type1: poke.baseData.type1Name,
      type2: poke.baseData.type2Name,
      level: poke.level,
      maxHp: 18 * poke.hp,
      hp: 18 * poke.hp,
      speed: poke.speed,
      skillMap: pokeSkill,
      crit: false,
      block: false,
      mana: 0,
      manaBonus: pokeBonusData?.manaBonus || 0,
      lifeSteal: pokeBonusData?.lifeSteal || 0,
      critChance: pokeBonusData?.critChance || 0,
      blockChance: pokeBonusData?.blockChance || 0,
      crescentBonuses: pokeBonusData?.crescentBonuses,
      statusCleanseChance: pokeBonusData?.statusCleanseChance,
      healingBonus: pokeBonusData?.healingBonus,
      buffBonus: pokeBonusData?.buffBonus,
      totalDamageDealt: 0,
      totalHealing: 0,
    })
  }

  const duelMap = new Map<number, DuelNxNRoundData>([])

  let duelFinished = false
  const isDraw = false
  let roundCount = 1
  let winnerTeam: any[] | null = null
  let loserTeam: any[] | null = null
  let winnerSide: 'right' | 'left' | undefined

  duelMap.set(1, {
    leftTeamData,
    rightTeamData,
  })

  const defeatedPokemonsIds: number[] = []

  const pokemonsInDuelOrder = [rightTeamData, leftTeamData].flat().sort((a, b) => b.speed - a.speed)

  while (duelFinished === false) {
    roundCount++

    const roundStart = (poke: RoundPokemonData) => {
      if (poke.hp <= 0) {
        if (data.returnOnlyPlayerPokemonDefeatedIds) {
          if (!poke.ownerId) return
        }
        defeatedPokemonsIds.push(poke.id)
        return
      }
      poke.crit = false
      poke.block = false

      if (poke.crescentBonuses) {
        console.log({ pb: poke.crescentBonuses })
        if (poke.crescentBonuses.block) poke.blockChance = Math.min(poke.crescentBonuses.block * roundCount, 0.2)
      }

      if (poke.mana < 100) poke.mana += 23 * (0.7 + Math.random() * 0.6) + poke.manaBonus
      if (poke.mana > 100) poke.mana = 100
      poke.crit = Math.random() + poke.critChance > 0.93
      poke.block = Math.random() + poke.blockChance > 0.93
      if (!poke.crit && poke.mana >= 100) {
        poke.crit = true
        poke.mana = 0
      }
    }

    for (const poke of pokemonsInDuelOrder) roundStart(poke)

    const dealDamage = (attacker: RoundPokemonData, target: RoundPokemonData) => {
      if (!target) {
        logger.error('no target found in round ' + roundCount)
        return
      }
      const currentSkill = attacker.skillMap?.get(target.name)
      if (!currentSkill || !currentSkill.processedAttackPower) {
        logger.error(`error: cant get skill for: ${attacker.name} vs ${target.name}`)
        return
      }
      if (attacker.heldItemName && plateTypeMap.get(attacker.heldItemName) === currentSkill?.typeName) {
        currentSkill.processedAttackPower = currentSkill.processedAttackPower * 1.1
      }
      if (attacker.crescentBonuses?.damage)
        currentSkill.processedAttackPower =
          currentSkill.processedAttackPower * attacker.crescentBonuses.damage * roundCount

      attacker.currentSkillName = currentSkill.name
      attacker.currentSkillType = currentSkill.typeName
      attacker.currentSkillPower = currentSkill.processedAttackPower * Math.max(1, 1 + roundCount ** 0.15)

      if (!target.block) {
        target.hp -= currentSkill.processedAttackPower * (0.9 + Math.random() * 0.2)
        attacker.hp += currentSkill.processedAttackPower * attacker.lifeSteal
        attacker.totalDamageDealt += currentSkill.processedAttackPower * (0.9 + Math.random() * 0.2)
      }
      if (attacker.crit) {
        console.log(`${attacker.name} encaixa um ${attacker.currentSkillName} crítico!`)
        if (!target.block) {
          target.hp -= currentSkill.processedAttackPower * (0.9 + Math.random() * 0.2) * 0.5
          attacker.hp += currentSkill.processedAttackPower * attacker.lifeSteal * 0.5
          attacker.totalDamageDealt += currentSkill.processedAttackPower * (0.9 + Math.random() * 0.2) * 0.5
        }
      }
      if (attacker.hp > attacker.maxHp) attacker.hp = attacker.maxHp
    }

    const getRoundTarget = (possibleTargets: RoundPokemonData[]) => {
      const aliveTargets = possibleTargets.filter(poke => poke.hp > 0)
      return aliveTargets[Math.floor(Math.random() * aliveTargets.length)]
    }

    for (const poke of pokemonsInDuelOrder) {
      if (poke.hp <= 0) continue
      const target = poke.team === 'right' ? getRoundTarget(leftTeamData) : getRoundTarget(rightTeamData)
      dealDamage(poke, target)
    }

    if (leftTeamData.map(poke => poke.hp).every(value => value <= 0)) {
      console.log('right team wins')
      winnerTeam = rightTeamData
      loserTeam = leftTeamData
      winnerSide = 'right'
      duelFinished = true
    }

    if (rightTeamData.map(poke => poke.hp).every(value => value <= 0)) {
      console.log('left team wins')
      winnerTeam = leftTeamData
      loserTeam = rightTeamData
      winnerSide = 'left'
      duelFinished = true
    }

    const leftTeamRoundData: RoundPokemonData[] = []
    const rightTeamRoundData: RoundPokemonData[] = []
    for (const poke of leftTeamData) {
      leftTeamRoundData.push({ ...poke })
    }
    for (const poke of rightTeamData) {
      rightTeamRoundData.push({ ...poke })
    }

    duelMap.set(roundCount, {
      leftTeamData: [...leftTeamRoundData],
      rightTeamData: [...rightTeamRoundData],
    })

    if (roundCount > 120) {
      throw new UnexpectedError('duel exceeded 120 rounds.')
    }
  }

  if (!winnerTeam || !loserTeam) throw new UnexpectedError('Time vencedor/perdedor do duelo não foi determinado')
  if (!winnerSide || !['right', 'left'].includes(winnerSide)) {
    throw new UnexpectedError('Índice do time vencedor/perdedor do duelo não foi determinado')
  }

  const imageGenFunctionMap = new Map<string, (data: TDuelRoundData) => Promise<string>>([
    ['3vs1', iGenDuel3X1Rounds],
    ['2vs1', iGenDuel2X1Rounds],
    ['2vs2', iGenDuelX2Rounds],
    ['1vs1', iGenDuelRound],
    ['3vs2', iGenDuel3X2Rounds],
    ['3vs3', iGenDuel3X3Rounds],
    ['3vs4', iGenDuel3X4Rounds],
  ])

  const imageGen = imageGenFunctionMap.get(leftTeamData.length + 'vs' + rightTeamData.length)
  if (!imageGen)
    throw new UnexpectedError(
      'Could not get imageGen function for: ' + leftTeamData.length + 'vs' + rightTeamData.length
    )
  const imageUrl = await imageGen({
    duelMap: duelMap,
    roundCount,
    leftTeam: leftTeamData,
    rightTeam: rightTeamData,
    winnerSide,
    staticImage: data.staticImage,
    backgroundTypeName: data.backgroundTypeName,
  })

  console.log('finished: ' + imageUrl)

  const damageDealtMessage = leftTeamData
    .map(poke => {
      return `*${poke.id} ${poke.name.toUpperCase()}* causou ${poke.totalDamageDealt.toFixed(2)} de dano!`
    })
    .join('\n')

  return {
    message: `DUELO X2`,
    isDraw: isDraw,
    winnerTeam: winnerTeam,
    loserTeam: loserTeam,
    imageUrl,
    defeatedPokemonsIds,
    damageDealtMessage,
  }
}

export type EffectivenessData = {
  innefective: string[]
  effective: string[]
  noDamage: string[]
}

export type TypeScoreObject = {
  best: string[]
  good: string[]
  neutral: string[]
  bad: string[]
  worse: string[]
}

const getBestTypes = (defenders: PokemonBaseData[] | RaidPokemonBaseData[]): TypeScoreObject => {
  const efDatas: EffectivenessData[] = []

  for (const defender of defenders) {
    const efDataOfType1 = defEffectivenessMap.get(defender.baseData.type1Name)
    if (efDataOfType1) efDatas.push(efDataOfType1)
    if (defender.baseData.type2Name) {
      const efDataOfType2 = defEffectivenessMap.get(defender.baseData.type2Name)
      if (efDataOfType2) efDatas.push(efDataOfType2)
    }
  }

  if (efDatas.length === 0) throw new UnexpectedError('efData object could not be created.')

  const typeScoreObj: any = {
    normal: 0,
    fire: 0,
    water: 0,
    electric: 0,
    grass: 0,
    ice: 0,
    fighting: 0,
    poison: 0,
    ground: 0,
    flying: 0,
    psychic: 0,
    bug: 0,
    rock: 0,
    ghost: 0,
    dragon: 0,
    dark: 0,
    steel: 0,
    fairy: 0,
  }

  for (const efData of efDatas) {
    for (const type of efData.effective) {
      if (type === '') continue
      typeScoreObj[type] += 1
    }
    for (const type of efData.innefective) {
      if (type === '') continue
      typeScoreObj[type] -= 1
    }
    for (const type of efData.noDamage) {
      if (type === '') continue
      typeScoreObj[type] -= 2
    }
  }
  delete typeScoreObj['']
  delete typeScoreObj[' ']

  const typeScoreObjEntries: [string, number][] = Object.entries(typeScoreObj)

  return {
    best: typeScoreObjEntries.filter(entry => entry[1] >= defenders.length * 1).map(entry => entry[0]),
    good: typeScoreObjEntries.filter(entry => entry[1] >= defenders.length * 0.5).map(entry => entry[0]),
    neutral: typeScoreObjEntries.filter(entry => entry[1] === 0).map(entry => entry[0]),
    bad: typeScoreObjEntries.filter(entry => entry[1] <= defenders.length * -0.5).map(entry => entry[0]),
    worse: typeScoreObjEntries.filter(entry => entry[1] <= defenders.length * -1).map(entry => entry[0]),
  }
}

type TGetBestSkillsParams = {
  attacker: PokemonBaseDataSkills | RaidPokemonBaseDataSkillsHeld
  defenders: PokemonBaseData[] | RaidPokemonBaseData[]
}

const getBestSkills = async ({ attacker, defenders }: TGetBestSkillsParams) => {
  const efData = getBestTypes(defenders)
  const skills = attacker.baseData.skills
  const skillTable = attacker.baseData.skillTable
  const learnedSkills: string[] = []

  for (const skill of skillTable) {
    const split = skill.split('%')
    if (Number(split[1]) <= attacker.level) {
      learnedSkills.push(split[0])
    }
  }

  const finalSkillMap = new Map<number, Skill>([])

  for (const skill of skills) {
    const talentCheck = await verifyTalentPermission(attacker, skill)
    if (!talentCheck.permit) {
      continue
    }
    const stab = () => {
      if (attacker.baseData.type1Name === skill.typeName) return 1.1
      if (attacker.baseData.type2Name === skill.typeName) return 1.1
      return 1
    }

    const talentBonus = 0.05 * talentCheck.count

    const getEffectivenessMultiplier = () => {
      if (efData.best.includes(skill.typeName)) return 2.5
      if (efData.good.includes(skill.typeName)) return 1.75
      if (efData.neutral.includes(skill.typeName)) return 1
      if (efData.bad.includes(skill.typeName)) return 0.5
      if (efData.worse.includes(skill.typeName)) return 0.25
      return 1
    }

    const power = skill.attackPower * getEffectivenessMultiplier() * stab() * (1 + talentBonus)
    finalSkillMap.set(power, skill)
  }

  return getBestSkillSet(finalSkillMap, attacker, defenders)
}

export const verifyTalentPermission = async (poke: PokemonBaseData | RaidPokemonBaseData, skill: Skill) => {
  const talents = [
    poke.talentId1,
    poke.talentId2,
    poke.talentId3,
    poke.talentId4,
    poke.talentId5,
    poke.talentId6,
    poke.talentId7,
    poke.talentId8,
    poke.talentId9,
  ]

  const typeId = findKeyByValue(talentIdMap, skill.typeName)

  const count = talents.reduce((count, current) => count + (current === typeId ? 1 : 0), 0)

  if (
    count >= 3 ||
    (count >= 2 && skill.attackPower <= 75) ||
    (count === 1 && skill.attackPower <= 40) ||
    (skill.typeName === 'normal' && skill.attackPower <= 50) ||
    poke.baseData.type1Name === skill.typeName ||
    poke.baseData.type2Name === skill.typeName
  )
    return {
      permit: true,
      count,
    }

  return {
    permit: false,
    count,
  }
}
