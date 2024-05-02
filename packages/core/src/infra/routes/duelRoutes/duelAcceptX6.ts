import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { ContinuousDuel6x6 } from '../../../server/modules/duel/ContinuousDuel6x6'
import { handleExperienceGain } from '../../../server/modules/pokemon/handleExperienceGain'
import {
  CouldNotUpdatePlayerError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  NoEnergyError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  SendEmptyMessageError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { logger } from '../../logger'
import { TRouteParams } from '../router'

export const duelAcceptX6 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , sessionIdString, fast] = data.routeParams
  const sessionId = Number(sessionIdString)
  if (typeof sessionId !== 'number') throw new TypeMissmatchError(sessionIdString, 'number')

  const player2 = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player2) throw new PlayerNotFoundError(data.playerPhone)
  if (player2.energy <= 0) throw new NoEnergyError(player2.name)

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
    },
    include: {
      creator: {
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
      },
      invited: {
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
      },
    },
  })
  if (!session || session.isFinished) throw new SessionIdNotFoundError(sessionId)
  if (
    !session.creator.teamPoke1 ||
    !session.creator.teamPoke2 ||
    !session.creator.teamPoke3 ||
    !session.creator.teamPoke4 ||
    !session.creator.teamPoke5 ||
    !session.creator.teamPoke6
  )
    throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name)
  if (
    !session.invited.teamPoke1 ||
    !session.invited.teamPoke2 ||
    !session.invited.teamPoke3 ||
    !session.invited.teamPoke4 ||
    !session.invited.teamPoke5 ||
    !session.invited.teamPoke6
  )
    throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name)

  if (session.invitedId !== player2.id) throw new SendEmptyMessageError()

  const staticImage = !!(fast && fast === 'FAST')

  const duel = await ContinuousDuel6x6({
    leftTeam: [
      session.creator.teamPoke1,
      session.creator.teamPoke2,
      session.creator.teamPoke3,
      session.creator.teamPoke4,
      session.creator.teamPoke5,
      session.creator.teamPoke6,
    ],
    rightTeam: [
      session.invited.teamPoke1,
      session.invited.teamPoke2,
      session.invited.teamPoke3,
      session.invited.teamPoke4,
      session.invited.teamPoke5,
      session.invited.teamPoke6,
    ],
    staticImage,
  })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')

  if (!duel.winnerTeam) throw new NoDuelWinnerFoundError()
  if (!duel.loserTeam) throw new NoDuelLoserFoundError()

  const winnerId = duel.winnerTeam[0].ownerId
  const loserId = duel.loserTeam[0].ownerId

  if (!winnerId) throw new UnexpectedError('duelo')
  if (!loserId) throw new UnexpectedError('duelo')

  if (isNaN(winnerId)) throw new TypeMissmatchError(winnerId.toString(), 'number')
  if (isNaN(loserId)) throw new TypeMissmatchError(loserId.toString(), 'number')

  const winner = await prisma.player.findFirstOrThrow({
    where: {
      id: winnerId,
    },
  })

  const loser = await prisma.player.findFirstOrThrow({
    where: {
      id: loserId,
    },
  })

  if (!winner) throw new PlayerNotFoundError(winnerId.toString())
  if (!loser) throw new PlayerNotFoundError(loserId.toString())

  const higherElo = Math.max(loser.elo, winner.elo)
  const lowerElo = Math.min(loser.elo, winner.elo)

  const getRewardsData = () => {
    const highEloGain = Math.max(10, Number((25 + (higherElo / 1200 - lowerElo / 1200) * 50).toFixed(2)))
    const lowEloGain = Math.max(10, Number((25 + (lowerElo / 1200 - higherElo / 1200) * 50).toFixed(2)))
    const highCashGain = Math.max(10, Number((100 + (higherElo / 1200 - lowerElo / 1200) * 70).toFixed(2)))
    const lowCashGain = Math.max(10, Number((100 + (lowerElo / 1200 - higherElo / 1200) * 70).toFixed(2)))
    const loseRatio = -1

    return {
      highEloGain,
      lowEloGain,
      highCashGain,
      lowCashGain,
      loseRatio,
    }
  }

  const rewardsData = getRewardsData()
  const eloLose = loser.elo === lowerElo ? rewardsData.lowEloGain : rewardsData.highEloGain
  const eloGain = winner.elo === lowerElo ? rewardsData.highEloGain : rewardsData.lowEloGain
  const cashGain = winner.elo === lowerElo ? rewardsData.highCashGain : rewardsData.lowCashGain

  const updatedWinnerPlayer = await prisma.player
    .update({
      where: {
        id: winner.id,
      },
      data: {
        energy: {
          decrement: 1,
        },
        elo: {
          increment: Math.round(eloGain),
        },
        cash: {
          increment: Math.round(cashGain),
        },
      },
    })
    .catch(e => logger.error(e))

  const updatedLoserPlayer = await prisma.player
    .update({
      where: {
        id: loser.id,
      },
      data: {
        energy: {
          decrement: 1,
        },
        elo: {
          decrement: Math.round(eloLose),
        },
      },
    })
    .catch(e => logger.error(e))

  if (!updatedLoserPlayer) throw new CouldNotUpdatePlayerError('id', loser.id)
  if (!updatedWinnerPlayer) throw new CouldNotUpdatePlayerError('id', winner.id)

  const loserPokemon0 = await prisma.pokemon.findFirst({
    where: {
      id: duel.loserTeam[0].id,
    },
    include: {
      baseData: true,
    },
  })

  const loserPokemon1 = await prisma.pokemon.findFirst({
    where: {
      id: duel.loserTeam[1].id,
    },
    include: {
      baseData: true,
    },
  })

  const winnerPokemon0 = await prisma.pokemon.findFirst({
    where: {
      id: duel.winnerTeam[0].id,
    },
    include: {
      baseData: true,
    },
  })

  const winnerPokemon1 = await prisma.pokemon.findFirst({
    where: {
      id: duel.winnerTeam[1].id,
    },
    include: {
      baseData: true,
    },
  })

  if (!loserPokemon0) throw new PokemonNotFoundError(duel.loserTeam[0].id)
  if (!winnerPokemon0) throw new PokemonNotFoundError(duel.winnerTeam[0].id)
  if (!loserPokemon1) throw new PokemonNotFoundError(duel.loserTeam[1].id)
  if (!winnerPokemon1) throw new PokemonNotFoundError(duel.winnerTeam[1].id)

  const levelDiffMessage = ''

  const handleLoseExp0 = await handleExperienceGain({
    pokemon: loserPokemon0,
    targetPokemon: winnerPokemon0,
  })
  const handleLoseExp1 = await handleExperienceGain({
    pokemon: loserPokemon1,
    targetPokemon: winnerPokemon1,
  })
  const handleWinExp0 = await handleExperienceGain({
    pokemon: winnerPokemon0,
    targetPokemon: loserPokemon0,
  })
  const handleWinExp1 = await handleExperienceGain({
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

  const afterMessage = `*${
    updatedWinnerPlayer.name
  }* vence o duelo e recebe +${eloGain} pontos de ranking e +${cashGain} POKECOINS.
*${updatedLoserPlayer.name}* perdeu ${eloLose} pontos de ranking.

*${duel.winnerTeam[0].name}* causou ${duel.winnerTeam[0].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[1].name}* causou ${duel.winnerTeam[1].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[0].name}* causou ${duel.loserTeam[0].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[1].name}* causou ${duel.loserTeam[1].totalDamageDealt.toFixed(0)} de dano.

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

${levelDiffMessage}
${winnerLevelUpMessage0}
${winnerLevelUpMessage1}
${loserLevelUpMessage0}
${loserLevelUpMessage1}`

  return {
    message: `${session.creator.name} enfrenta ${session.invited.name} em um duelo x6!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    isAnimated: !staticImage,
  }
}
