import { TDuelRoundData, iGenDuel2X1Rounds } from '../../../../../image-generator/src/iGenDuel2X1Rounds'
import { iGenDuel3X1Rounds } from '../../../../../image-generator/src/iGenDuel3X1Rounds'
import { iGenDuel3X2Rounds } from '../../../../../image-generator/src/iGenDuel3X2Rounds'
import { iGenDuel3X3Rounds } from '../../../../../image-generator/src/iGenDuel3X3Rounds'
import { iGenDuel3X4Rounds } from '../../../../../image-generator/src/iGenDuel3X4Rounds'
import { iGenDuelRound } from '../../../../../image-generator/src/iGenDuelRound'
import { iGenDuelX2Rounds } from '../../../../../image-generator/src/iGenDuelX2Rounds'
import { UnexpectedError } from '../../../infra/errors/AppErrors'
import { logger } from '../../../infra/logger'
import { defEffectivenessMap } from '../../constants/defEffectivenessMap'
import { plateTypeMap } from '../../constants/plateTypeMap'
import { talentIdMap } from '../../constants/talentIdMap'
import { talentPowerBonusMap } from '../../constants/talentPowerBonusMap'
import { typeHeldItemMap } from '../../constants/typeHeldItemMap'
import { findKeyByValue } from '../../helpers/findKeyByValue'

import prisma from '../../../../../prisma-provider/src'
import {
  DuelNxNRoundData,
  PokemonBaseData,
  PokemonBaseDataSkillsHeld,
  RaidPokemonBaseData,
  RaidPokemonBaseDataSkillsHeld,
  RoundPokemonData,
  TDuelNXNResponse,
  attackPower,
  enemyName,
} from '../../../types'
import { Skill } from '../../../types/prisma'
import { getBestSkillSet } from '../../helpers/getBestSkillSet'
import { DuelPokemonExtra, getTeamBonuses } from './getTeamBonuses'

type TParams = {
  leftTeam: PokemonBaseDataSkillsHeld[]
  rightTeam: PokemonBaseDataSkillsHeld[] | RaidPokemonBaseDataSkillsHeld[]
  wildBattle?: true
  staticImage?: boolean
  returnOnlyPlayerPokemonDefeatedIds?: boolean
  backgroundTypeName?: string
  forceWin?: boolean
}

export const duelNXN = async (data: TParams): Promise<TDuelNXNResponse | void> => {
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

  const rightPokesSkillMap = new Map<
    number,
    | {
        damageSkills: Map<Skill, Map<enemyName, attackPower>>
        tankerSkills: Skill[]
        supportSkills: Skill[]
      }
    | undefined
  >([])
  const leftPokesSkillMap = new Map<
    number,
    | {
        damageSkills: Map<Skill, Map<enemyName, attackPower>>
        tankerSkills: Skill[]
        supportSkills: Skill[]
      }
    | undefined
  >([])

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
    const roleBonuses = {
      damage: 0,
      defense: 0,
      support: 0,
    }
    if (poke.role === 'TANKER') roleBonuses.defense = 0.1
    if (poke.role === 'DAMAGE') roleBonuses.damage = 0.1
    if (poke.role === 'SUPPORT') roleBonuses.support = 0.1
    leftTeamData.push({
      name: poke.baseData.name,
      id: poke.id,
      isGiant: poke.isGiant,
      pokemonBaseData: poke,
      ownerId: poke.ownerId,
      heldItemName: poke.heldItem?.baseItem.name || undefined,
      team: 'left',
      role: poke.role ?? 'DAMAGE',
      spriteUrl: poke.spriteUrl,
      type1: poke.baseData.type1Name,
      type2: poke.baseData.type2Name,
      level: poke.level,
      maxHp: 12 * poke.hp * (poke.isGiant ? 1.2 : 1),
      hp: 12 * poke.hp * (poke.isGiant ? 1.2 : 1),
      atk: poke.atk,
      spAtk: poke.spAtk,
      def: poke.def,
      spDef: poke.spDef,
      damageResistance: (poke.heldItem?.baseItem.name === 'x-defense' ? 0.15 : 0) + roleBonuses.defense,
      damageAmplifying: roleBonuses.damage,
      speed: poke.speed,
      skillMap: pokeSkill,
      crit: false,
      block: false,
      mana: 0,
      roleBonusDamage: roleBonuses.damage,
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
      totalDamageReceived: 0,
      buffData: {
        atk: 0,
        spAtk: 0,
        def: 0,
        spDef: 0,
      },
    })
  }
  for (const poke of rightTeam) {
    const pokeSkill = rightPokesSkillMap.get(poke.id)
    const pokeBonusData = rightPokesBonusesMap.get(poke.id)
    const roleBonuses = {
      damage: 0,
      defense: 0,
      support: 0,
    }
    if ('role' in poke && poke.role === 'TANKER') roleBonuses.defense = 0.1
    if ('role' in poke && poke.role === 'DAMAGE') roleBonuses.damage = 0.1
    if ('role' in poke && poke.role === 'SUPPORT') roleBonuses.support = 0.1
    rightTeamData.push({
      name: poke.baseData.name,
      pokemonBaseData: poke,
      id: poke.id,
      isGiant: 'isGiant' in poke && poke.isGiant,
      ownerId: 'ownerId' in poke ? poke.ownerId : undefined,
      heldItemName: poke.heldItem?.baseItem.name || undefined,
      team: 'right',
      role: 'role' in poke && poke.role ? poke.role : 'DAMAGE',
      spriteUrl: poke.spriteUrl,
      type1: poke.baseData.type1Name,
      type2: poke.baseData.type2Name,
      level: poke.level,
      maxHp: 12 * poke.hp * ('isGiant' in poke && poke.isGiant ? 1.2 : 1),
      hp: 12 * poke.hp * ('isGiant' in poke && poke.isGiant ? 1.2 : 1),
      atk: poke.atk * (data.forceWin ? 0 : 1),
      spAtk: poke.spAtk * (data.forceWin ? 0 : 1),
      def: poke.def,
      spDef: poke.spDef,
      damageResistance: (poke.heldItem?.baseItem.name === 'x-defense' ? 0.15 : 0) + roleBonuses.defense,
      damageAmplifying: roleBonuses.damage,
      speed: poke.speed,
      skillMap: pokeSkill,
      crit: false,
      block: false,
      mana: 0,
      roleBonusDamage: roleBonuses.damage,
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
      totalDamageReceived: 0,
      buffData: {
        atk: 0,
        spAtk: 0,
        def: 0,
        spDef: 0,
      },
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
    leftTeamData: [...leftTeamData],
    rightTeamData: [...rightTeamData],
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

    const getCurrentSkillForDamageRole = (
      attacker: RoundPokemonData,
      enemies: RoundPokemonData[]
    ): { skill: Skill | undefined; pwr: number; targets: RoundPokemonData[] } | undefined => {
      const skillSelectionMap = new Map<Skill, { pwr: attackPower; targets: RoundPokemonData[] }>([])
      if (!attacker.skillMap) {
        logger.error(`no skill map for ${attacker.name}`)
        return undefined
      }

      for (const [skill, skillMap] of attacker.skillMap.damageSkills) {
        if (skill.pp <= 0) console.log(`no more pp for ${skill.name}`)
        if (['selected-pokemon', 'random-oponent', 'selected-pokemon-me-first'].includes(skill.target)) {
          for (const enemy of enemies) {
            skillSelectionMap.set(skill, { pwr: skillMap.get(enemy.name) ?? 0, targets: [enemy] })
          }
        }
        if (['all-other-pokemon', 'all-oponents'].includes(skill.target)) {
          const totalDamage = enemies.reduce((accumulator, pokemon) => {
            return accumulator + (skillMap.get(pokemon.name) ?? 0)
          }, 0)
          skillSelectionMap.set(skill, { pwr: totalDamage, targets: enemies })
        }
      }

      let bestSkill: { skill: Skill | undefined; pwr: number; targets: RoundPokemonData[] } = {
        skill: undefined,
        pwr: 0,
        targets: [],
      }
      console.log(JSON.stringify(skillSelectionMap))
      for (const [skill, attackData] of skillSelectionMap) {
        if (attackData.pwr > bestSkill.pwr) {
          bestSkill = {
            skill,
            pwr: attackData.pwr,
            targets: attackData.targets,
          }
        }
      }

      return bestSkill
    }

    const dealDamage = (attacker: RoundPokemonData, enemies: RoundPokemonData[]) => {
      if (!enemies) {
        logger.error('no enemies found in round ' + roundCount)
        return
      }
      const currentSkillData = getCurrentSkillForDamageRole(attacker, enemies)
      if (!currentSkillData || !currentSkillData.skill) {
        console.log('no skill for ', attacker.name)
        return
      }
      if (attacker.crescentBonuses?.damage)
        currentSkillData.pwr = currentSkillData.pwr * attacker.crescentBonuses.damage * roundCount

      attacker.currentSkillName = currentSkillData.skill.name
      attacker.currentSkillType = currentSkillData.skill.typeName
      attacker.currentSkillPower = currentSkillData.pwr
      attacker.currentSkillPP = currentSkillData.skill.pp

      currentSkillData.skill.pp -= 1

      console.log(
        `${attacker.id}-${attacker.name} uses ${currentSkillData.skill.name} in ${currentSkillData.targets.map(
          t => t.name
        )}`
      )

      for (const target of currentSkillData.targets) {
        const adratio = adRatio(currentSkillData.skill, attacker, target)
        const pwrWithADRatio = attacker.currentSkillPower * adratio * (1 + attacker.damageAmplifying)
        const pwrDividedByTargets = pwrWithADRatio / currentSkillData.targets.length
        if (!target.block) {
          target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance)
          attacker.hp += pwrDividedByTargets * attacker.lifeSteal * (1 - target.damageResistance)
          attacker.totalDamageDealt += pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance)
        }
        if (attacker.crit) {
          if (!target.block) {
            target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance)
            attacker.hp += pwrDividedByTargets * attacker.lifeSteal * 0.5 * (1 - target.damageResistance)
            attacker.totalDamageDealt +=
              pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance)
          }
        }
        if (attacker.hp > attacker.maxHp) attacker.hp = attacker.maxHp
      }
    }

    const getEnemyTargets = (enemies: RoundPokemonData[]): RoundPokemonData[] => {
      const aliveTargets = enemies.filter(poke => poke.hp > 0)
      const aliveDefenders = aliveTargets.filter(t => t.role === 'TANKER' && t.hp > 0)
      if (aliveDefenders.length > 0) return aliveDefenders
      return aliveTargets
    }

    const getCurrentSkillForSupportRole = (
      pokemon: RoundPokemonData,
      allies: RoundPokemonData[]
    ): { skill: Skill; targets: RoundPokemonData[] } | undefined => {
      let suggestedSkillCategory = 'net-good-stats'

      const lowHpAllies = allies.filter(p => p.hp < p.maxHp * 0.67)
      lowHpAllies.sort((a, b) => a.hp - b.hp)
      if (lowHpAllies.length > 0) suggestedSkillCategory = 'heal'

      const skills = pokemon.skillMap?.supportSkills
      if (!skills) {
        console.log(`d2ths- no support skills for ${pokemon.name}`)
        return undefined
      }
      const healingSkills = skills.filter(s => s.category === 'heal')
      const buffSkills = skills.filter(s => s.category === 'net-good-stats')

      if (suggestedSkillCategory === 'heal' && healingSkills.length > 0) {
        return {
          skill: healingSkills[0],
          targets: [lowHpAllies[0]],
        }
      }

      if (buffSkills.length > 0) {
        // try to buff the tanker def/spdef
        const tankers = allies.filter(p => p.role === 'TANKER')
        const defensiveBuffSkills = buffSkills.filter(s => ['defense', 'special-defense'].includes(s.statChangeName))
        const defensiveBuffSkill = defensiveBuffSkills[Math.floor(Math.random() * defensiveBuffSkills.length)]
        const offensiveBuffSkills = buffSkills.filter(s => ['attack', 'special-attack'].includes(s.statChangeName))
        const offensiveBuffSkill = offensiveBuffSkills[Math.floor(Math.random() * offensiveBuffSkills.length)]

        const getOffensiveBuffTargets = (skill: Skill, allies: RoundPokemonData[]): RoundPokemonData[] => {
          if (['selected-pokemon', 'ally'].includes(skill.target)) {
            const damagers = allies.filter(p => p.role === 'DAMAGE')
            if (damagers.length > 0) return [damagers[Math.floor(Math.random() * damagers.length)]]
            return [allies[Math.floor(Math.random() * allies.length)]]
          }
          if (skill.target === 'user-and-allies') return allies
          return []
        }

        const getDeffensiveBuffTargets = (skill: Skill, allies: RoundPokemonData[]): RoundPokemonData[] => {
          if (['selected-pokemon', 'ally'].includes(skill.target)) {
            const tankers = allies.filter(p => p.role === 'TANKER')
            if (tankers.length > 0) return [tankers[Math.floor(Math.random() * tankers.length)]]
            return [allies[Math.floor(Math.random() * allies.length)]]
          }
          if (skill.target === 'user-and-allies') return allies
          return []
        }

        if (tankers.length > 0 && defensiveBuffSkills.length > 0) {
          const skill = defensiveBuffSkill
          return {
            skill,
            targets: getDeffensiveBuffTargets(skill, allies),
          }
        }
        if (offensiveBuffSkill) {
          const skill = offensiveBuffSkill
          return {
            skill,
            targets: getOffensiveBuffTargets(offensiveBuffSkill, allies),
          }
        }
      }

      console.log(`b3ths- no support skills for ${pokemon.name}`)
      return undefined
    }

    const support = async (pokemon: RoundPokemonData, allies: RoundPokemonData[]) => {
      if (!allies) {
        logger.error(`No allies found in round ${roundCount} for ${pokemon.name}`)
        return
      }

      const currentSkillData = getCurrentSkillForSupportRole(pokemon, allies)
      if (!currentSkillData || !currentSkillData.skill) {
        handleRoundActions({
          poke: pokemon,
          forceAttack: true,
        })
        return
      }

      pokemon.currentSkillName = currentSkillData.skill.name
      pokemon.currentSkillType = currentSkillData.skill.typeName
      pokemon.currentSkillPower = 0
      pokemon.currentSkillPP = currentSkillData.skill.pp

      currentSkillData.skill.pp -= 1

      console.log(
        `${pokemon.id}-${pokemon.name} uses ${currentSkillData.skill.name} in ${currentSkillData.targets.map(
          t => t.name
        )}`
      )

      if (currentSkillData.skill.category === 'heal') {
        const talentData = await verifyTalentPermission(pokemon.pokemonBaseData, currentSkillData.skill)
        const talentBonus = talentData.count * 0.04
        const healingPower =
          currentSkillData.skill.healing +
          (4 * (pokemon.spAtk / 200)) ** 4.15 *
            getHeldItemMultiplier(pokemon.pokemonBaseData, currentSkillData.skill, 'x-acuraccy') *
            (1 + talentBonus)

        for (const target of currentSkillData.targets) {
          if (target.hp > 0) target.hp += healingPower
          pokemon.totalHealing += healingPower
        }
      }

      if (currentSkillData.skill.category === 'net-good-stats') {
        const talentData = await verifyTalentPermission(pokemon.pokemonBaseData, currentSkillData.skill)
        const talentBonus = talentData.count * 0.06

        const nameFixMap = new Map<string, string>([
          ['attack', 'atk'],
          ['defense', 'def'],
          ['special-attack', 'spAtk'],
          ['special-defense', 'spDef'],
        ])

        const statName = nameFixMap.get(currentSkillData.skill.statChangeName)
        if (!statName) {
          logger.error(`failed to find statname for ${currentSkillData.skill.statChangeName}`)
          return
        }
        const statChangePower =
          currentSkillData.skill.statChangeAmount * 0.05 * (1 + talentBonus) * (1 + pokemon.spAtk / 2000)
        for (const target of currentSkillData.targets) {
          if (target.hp <= 0) continue
          target[statName] += target[statName] * statChangePower
          pokemon.buffData[statName] += target[statName] * (1 - statChangePower)
        }
      }
    }

    const getCurrentSkillForTankerRole = (
      pokemon: RoundPokemonData,
      allies: RoundPokemonData[],
      enemies: RoundPokemonData[]
    ): { skill: Skill; targets: RoundPokemonData[] } | undefined => {
      const skills = pokemon.skillMap?.tankerSkills
      if (!skills || skills.length === 0) {
        handleRoundActions({
          poke: pokemon,
          forceAttack: true,
        })
        return
      }
      const skill = skills[Math.floor(Math.random() * skills.length)]
      let targets: RoundPokemonData[] = []
      if (skill.target === 'user') targets = [pokemon]
      if (skill.target === 'user-and-allies') targets = allies
      if (skill.target === 'selected-pokemon' && skill.category.includes('damage')) targets = [enemies[0]]
      if (skill.target === 'all-oponents' && skill.category.includes('damage')) targets = enemies

      if (targets.length === 0) {
        logger.error('no targets for: ' + skill.target)
        return undefined
      }

      return {
        skill,
        targets,
      }
    }

    const tank = async (pokemon: RoundPokemonData, allies: RoundPokemonData[], enemies: RoundPokemonData[]) => {
      if (!allies) {
        logger.error(`No allies found in round ${roundCount} for ${pokemon.name} in tank`)
        return
      }
      if (!enemies) {
        logger.error(`No enemies found in round ${roundCount} for ${pokemon.name} in tank`)
        return
      }

      const currentSkillData = getCurrentSkillForTankerRole(pokemon, allies, enemies)
      if (!currentSkillData || !currentSkillData.skill) {
        handleRoundActions({
          poke: pokemon,
          forceAttack: true,
        })
        return
      }

      pokemon.currentSkillName = currentSkillData.skill.name
      pokemon.currentSkillType = currentSkillData.skill.typeName
      pokemon.currentSkillPower = currentSkillData.skill.attackPower
      pokemon.currentSkillPP = currentSkillData.skill.pp

      currentSkillData.skill.pp -= 1

      if (currentSkillData.skill.category === 'damage+heal') {
        for (const target of currentSkillData.targets) {
          const pwrWithADRatio =
            ((pokemon.currentSkillPower ?? 0) * adRatio(currentSkillData.skill, pokemon, target)) / 50
          const pwrDividedByTargets = pwrWithADRatio / currentSkillData.targets.length
          if (!target.block) {
            target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance)
            pokemon.hp +=
              pwrDividedByTargets *
              pokemon.lifeSteal *
              (1 - target.damageResistance) *
              (1 + currentSkillData.skill.drain / 100)
            pokemon.totalDamageDealt +=
              pwrDividedByTargets * (0.9 + Math.random() * 0.2) * (1 - target.damageResistance)
          }
          if (pokemon.crit) {
            if (!target.block) {
              target.hp -= pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance)
              pokemon.hp +=
                pwrDividedByTargets *
                pokemon.lifeSteal *
                0.5 *
                (1 - target.damageResistance) *
                (1 + currentSkillData.skill.drain / 100)
              pokemon.totalDamageDealt +=
                pwrDividedByTargets * (0.9 + Math.random() * 0.2) * 0.5 * (1 - target.damageResistance)
            }
          }
          if (pokemon.hp > pokemon.maxHp) pokemon.hp = pokemon.maxHp
        }
      }

      if (currentSkillData.skill.category === 'net-good-stats') {
        const talentData = await verifyTalentPermission(pokemon.pokemonBaseData, currentSkillData.skill)
        const talentBonus = talentData.count * 0.06

        const nameFixMap = new Map<string, string>([
          ['attack', 'atk'],
          ['defense', 'def'],
          ['special-attack', 'spAtk'],
          ['special-defense', 'spDef'],
        ])

        const statName = nameFixMap.get(currentSkillData.skill.statChangeName)
        if (!statName) {
          logger.error(`failed to find statname for ${currentSkillData.skill.statChangeName}`)
          return
        }
        const statChangePower =
          currentSkillData.skill.statChangeAmount * 0.05 * (1 + talentBonus) * (1 + pokemon.spAtk / 2000)
        for (const target of currentSkillData.targets) {
          target[statName] += target[statName] * statChangePower
          pokemon.buffData[statName] += target[statName] * (1 - statChangePower)
        }
      }
    }

    type THandleRoundActions = {
      poke: RoundPokemonData
      forceAttack?: boolean
    }

    const handleRoundActions = async ({ poke, forceAttack }: THandleRoundActions) => {
      if (poke.hp <= 0) return
      const team = poke.team === 'right' ? rightTeamData : leftTeamData
      const aliveTeam = team.filter(p => p.hp > 0)
      const targets = poke.team === 'right' ? getEnemyTargets(leftTeamData) : getEnemyTargets(rightTeamData)
      if (forceAttack) {
        dealDamage(poke, targets)
        return
      }
      if ('role' in poke && poke.role === 'SUPPORT') {
        if (
          aliveTeam.every(p => p.role === 'SUPPORT') ||
          aliveTeam.filter(p => ['DAMAGE', 'TANKER'].includes(p.role)).length === 0
        ) {
          dealDamage(poke, targets)
          return
        }

        await support(poke, aliveTeam)
        return
      }
      if ('role' in poke && poke.role === 'TANKER') {
        if (
          aliveTeam.every(p => p.role === 'TANKER') ||
          aliveTeam.filter(p => ['DAMAGE'].includes(p.role)).length === 0
        ) {
          dealDamage(poke, targets)
          return
        }
        await tank(poke, team, targets)
        return
      }

      dealDamage(poke, targets)
    }

    for (const poke of pokemonsInDuelOrder) {
      handleRoundActions({
        poke,
      })
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

    console.log(
      leftTeamRoundData[0]?.hp,
      leftTeamRoundData[1]?.hp + ' VS ' + rightTeamRoundData[0]?.hp,
      rightTeamRoundData[1]?.hp
    )

    if (roundCount > 145) {
      if (data.forceWin) {
        console.log('left team force wins')
        winnerTeam = leftTeamData
        loserTeam = rightTeamData
        winnerSide = 'left'
        duelFinished = true
      } else {
        throw new UnexpectedError('duel exceeded 145 rounds.')
      }
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

  const damageDealtMessage = `
  ${[...leftTeamData]
    .map(p => {
      return `*${p.id}-${p.name}* causou ${p.totalDamageDealt.toFixed(0)} de dano.`
    })
    .filter((m: string) => m.length > 0)
    .join('\n')}
  
  ${[...leftTeamData]
    .map(p => {
      if (p.totalHealing > 0) return `*${p.name}* curou ${p.totalHealing.toFixed(0)}.`
      return ''
    })
    .filter((m: string) => m.length > 0)
    .join('\n')}
  
  ${[...leftTeamData]
    .map(p => {
      const messages: string[] = []
      for (const key in p.buffData) {
        if (p.buffData[key] > 0) {
          messages.push(`*${p.name}* aumentou a ${key} de seu time em ${p.buffData[key]}.`)
        }
      }
      return messages.join('\n')
    })
    .filter((m: string) => m.length > 5)
    .join('\n')}
  `

  console.log({ damageDealtMessage })

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
  attacker: PokemonBaseDataSkillsHeld | RaidPokemonBaseDataSkillsHeld
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
      continue
    }
  }

  const finalSkillMap: [number, Skill][] = []

  for (const skill of skills) {
    if (!learnedSkills.includes(skill.name)) {
      continue
    }
    const talentCheck = await verifyTalentPermission(attacker, skill)
    if (!talentCheck.permit) {
      continue
    }
    const stab = () => {
      if (attacker.baseData.type1Name === skill.typeName) return 1.04
      if (attacker.baseData.type2Name === skill.typeName) return 1.04
      return 1
    }

    const talentBonus = talentPowerBonusMap.get(talentCheck.count) ?? 0

    const getEffectivenessMultiplier = () => {
      if (efData.best.includes(skill.typeName)) return 2.25
      if (efData.good.includes(skill.typeName)) return 1.55
      if (efData.neutral.includes(skill.typeName)) return 1
      if (efData.bad.includes(skill.typeName)) return 0.65
      if (efData.worse.includes(skill.typeName)) return 0.35
      return 1
    }

    const power =
      skill.attackPower *
      getEffectivenessMultiplier() *
      stab() *
      (1 + talentBonus) *
      getHeldItemMultiplier(attacker, skill, 'x-attack')
    finalSkillMap.push([power, skill])
  }

  return getBestSkillSet(finalSkillMap, attacker, defenders)
}

export const verifyTalentPermission = (
  poke: PokemonBaseData | RaidPokemonBaseData,
  skill: Skill
): { permit: boolean; count: number } => {
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

const getHeldItemMultiplier = (
  pokemon: PokemonBaseDataSkillsHeld | RaidPokemonBaseDataSkillsHeld,
  skill: Skill,
  xItemName: string
) => {
  const heldName = pokemon.heldItem?.baseItem.name
  if (!heldName) return 1
  if (heldName && plateTypeMap.get(heldName) === skill.typeName) return 1.07
  if (heldName && heldName === skill.typeName + '-gem') return 1.14
  if (heldName && typeHeldItemMap.get(skill.typeName) === heldName) return 1.2
  if (heldName && heldName === xItemName) return 1.11
  return 1
}

const adRatio = (skill: Skill, attacker: RoundPokemonData, defender: RoundPokemonData) => {
  if (skill.isPhysical) return attacker.atk / defender.def
  return attacker.spAtk / defender.spDef
}
