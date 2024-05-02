import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { ContinuousDuel6x6 } from '../../../server/modules/duel/ContinuousDuel6x6'
import { generateRaidPokemon } from '../../../server/modules/pokemon/generate/generateRaidPokemon'
import {
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  NoEnergyError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const duelRandom = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , duelLevelString] = data.routeParams
  const duelLevel = Number(duelLevelString)
  if (typeof duelLevel !== 'number') throw new TypeMissmatchError(duelLevelString, 'number')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
      teamPoke2: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
      teamPoke3: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
      teamPoke4: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
      teamPoke5: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
      teamPoke6: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (player.energy <= 0) throw new NoEnergyError(player.name)

  if (
    !player.teamPoke1 ||
    !player.teamPoke2 ||
    !player.teamPoke3 ||
    !player.teamPoke4 ||
    !player.teamPoke5 ||
    !player.teamPoke6
  )
    throw new PlayerDoesNotHaveThePokemonInTheTeamError(player.name)

  const possiblePokemons = await prisma.basePokemon.findMany({
    where: {
      BaseExperience: {
        gt: 120,
      },
    },
  })

  const getEnemyPokes = []
  for (let i = 0; i < 6; i++) {
    getEnemyPokes.push(
      generateRaidPokemon({
        name: possiblePokemons[Math.floor(Math.random() * possiblePokemons.length)].name,
        level: duelLevel,
        shinyBonusChance: 0.5,
      })
    )
  }

  const enemyPokes = await Promise.all(getEnemyPokes)

  const duel = await ContinuousDuel6x6({
    leftTeam: [
      player.teamPoke1,
      player.teamPoke2,
      player.teamPoke3,
      player.teamPoke4,
      player.teamPoke5,
      player.teamPoke6,
    ],
    rightTeam: enemyPokes,
  })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')

  if (!duel.winnerTeam) throw new NoDuelWinnerFoundError()
  if (!duel.loserTeam) throw new NoDuelLoserFoundError()

  const winnerId = duel.winnerTeam[0].ownerId
  const loserId = duel.loserTeam[0].ownerId

  /* 
  let levelDiffMessage = ''
  let handleLoseExp0
  let handleLoseExp1
  let handleWinExp0
  let handleWinExp1

  handleLoseExp0 = await handleExperienceGain({
    pokemon: loserPokemon0,
    targetPokemon: winnerPokemon0,
  })
  handleLoseExp1 = await handleExperienceGain({
    pokemon: loserPokemon1,
    targetPokemon: winnerPokemon1,
  })
  handleWinExp0 = await handleExperienceGain({
    pokemon: winnerPokemon0,
    targetPokemon: loserPokemon0,
  })
  handleWinExp1 = await handleExperienceGain({
    pokemon: winnerPokemon1,
    targetPokemon: loserPokemon1,
  })

  const winnerLevelUpMessage0 = handleWinExp0?.leveledUp
    ? `*${winnerPokemon0.baseData.name}* subiu para o nível ${handleWinExp0.pokemon.level}!`
    : ''
  const loserLevelUpMessage0 = handleLoseExp0?.leveledUp
    ? `*${loserPokemon0.baseData.name}* subiu para o nível ${handleLoseExp0.pokemon.level}!`
    : ''
  const winnerLevelUpMessage1 = handleWinExp1?.leveledUp
    ? `*${winnerPokemon1.baseData.name}* subiu para o nível ${handleWinExp1.pokemon.level}!`
    : ''
  const loserLevelUpMessage1 = handleLoseExp1?.leveledUp
    ? `*${loserPokemon1.baseData.name}* subiu para o nível ${handleLoseExp1.pokemon.level}!`
    : ''

*/

  const afterMessage = `
*${duel.winnerTeam[0].name}* causou ${duel.winnerTeam[0].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[1].name}* causou ${duel.winnerTeam[1].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[2].name}* causou ${duel.winnerTeam[2].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[3].name}* causou ${duel.winnerTeam[3].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[4].name}* causou ${duel.winnerTeam[4].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[5].name}* causou ${duel.winnerTeam[5].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[0].name}* causou ${duel.loserTeam[0].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[1].name}* causou ${duel.loserTeam[1].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[2].name}* causou ${duel.loserTeam[2].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[3].name}* causou ${duel.loserTeam[3].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[4].name}* causou ${duel.loserTeam[4].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[5].name}* causou ${duel.loserTeam[5].totalDamageDealt.toFixed(0)} de dano.

${[...duel.winnerTeam, ...duel.loserTeam]
  .map(p => {
    if (p.totalHealing > 0) return `*${p.name}* curou ${p.totalHealing.toFixed(0)}.`
    return ''
  })
  .filter((m: string) => m.length > 0)
  .join('\n')}

${[...duel.winnerTeam, ...duel.loserTeam]
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

  /* ${levelDiffMessage}
${winnerLevelUpMessage0}
${winnerLevelUpMessage1}
${loserLevelUpMessage0}
${loserLevelUpMessage1}
*/

  return {
    message: `${player.name} enfrenta TREINADOR TESTE ALEATÓRIO em um duelo x6!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    isAnimated: false,
  }
}
