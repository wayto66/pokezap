import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
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
import { IResponse } from '../../../server/models/IResponse'
import { duelX1 } from '../../../server/modules/duel/duelX1'
import { TRouteParams } from '../router'
import { handleExperienceGain } from '../../../server/modules/pokemon/handleExperienceGain'
import { duelX2 } from '../../../server/modules/duel/duelX2'

export const duelAcceptX2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , sessionIdString] = data.routeParams
  const sessionId = Number(sessionIdString)
  if (typeof sessionId !== 'number') throw new TypeMissmatchError(sessionIdString, 'number')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player2 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player2) throw new PlayerNotFoundError(data.playerPhone)
  if (player2.energy <= 0) throw new NoEnergyError(player2.name)

  const session = await prismaClient.session.findFirst({
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
            },
          },
          teamPoke2: {
            include: {
              baseData: {
                include: {
                  skills: true,
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
            },
          },
          teamPoke2: {
            include: {
              baseData: {
                include: {
                  skills: true,
                },
              },
            },
          },
        },
      },
    },
  })
  if (!session || session.isFinished) throw new SessionIdNotFoundError(sessionId)
  if (!session.creator.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name)
  if (!session.invited.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name)
  if (!session.creator.teamPoke2) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name)
  if (!session.invited.teamPoke2) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name)

  if (session.invitedId !== player2.id) throw new SendEmptyMessageError()

  const duel = await duelX2({
    player1: session.creator,
    player2: session.invited,
    team1: [session.creator.teamPoke1, session.creator.teamPoke2],
    team2: [session.invited.teamPoke1, session.invited.teamPoke2],
  })

  console.log({ duel })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')

  if (!duel.winnerTeam) throw new NoDuelWinnerFoundError()
  if (!duel.loserTeam) throw new NoDuelLoserFoundError()

  const winnerId = duel.winnerTeam[0].ownerId
  const loserId = duel.loserTeam[0].ownerId

  if (!winnerId) throw new UnexpectedError('duelo')
  if (!loserId) throw new UnexpectedError('duelo')

  if (isNaN(winnerId)) throw new TypeMissmatchError(winnerId, 'number')
  if (isNaN(loserId)) throw new TypeMissmatchError(loserId, 'number')

  const winner = await prismaClient.player.findFirstOrThrow({
    where: {
      id: winnerId,
    },
  })

  const loser = await prismaClient.player.findFirstOrThrow({
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

  const updatedWinnerPlayer = await prismaClient.player
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
    .catch(e => console.log(e))

  const updatedLoserPlayer = await prismaClient.player
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
    .catch(e => console.log(e))

  if (!updatedLoserPlayer) throw new CouldNotUpdatePlayerError('id', loser.id)
  if (!updatedWinnerPlayer) throw new CouldNotUpdatePlayerError('id', winner.id)

  const loserPokemon0 = await prismaClient.pokemon.findFirst({
    where: {
      id: duel.loserTeam[0].id,
    },
    include: {
      baseData: true,
    },
  })

  const loserPokemon1 = await prismaClient.pokemon.findFirst({
    where: {
      id: duel.loserTeam[1].id,
    },
    include: {
      baseData: true,
    },
  })

  const winnerPokemon0 = await prismaClient.pokemon.findFirst({
    where: {
      id: duel.winnerTeam[0].id,
    },
    include: {
      baseData: true,
    },
  })

  const winnerPokemon1 = await prismaClient.pokemon.findFirst({
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

  let levelDiffMessage = ''
  let handleLoseExp0
  let handleLoseExp1
  let handleWinExp0
  let handleWinExp1

  if (
    loserPokemon0.level - winnerPokemon0.level > 9 ||
    loserPokemon0.level - winnerPokemon1.level > 9 ||
    loserPokemon1.level - winnerPokemon0.level > 9 ||
    loserPokemon1.level - winnerPokemon1.level > 9
  ) {
    levelDiffMessage = `Devido à uma diferença de 10 níveis, não foi possível obter experiência na batalha.`
  } else {
    handleLoseExp0 = await handleExperienceGain({
      pokemon: loserPokemon0,
      targetPokemon: winnerPokemon0,
      divide: true,
    })
    handleLoseExp1 = await handleExperienceGain({
      pokemon: loserPokemon1,
      targetPokemon: winnerPokemon1,
      divide: true,
    })
    handleWinExp0 = await handleExperienceGain({
      pokemon: winnerPokemon0,
      targetPokemon: loserPokemon0,
      divide: true,
    })
    handleWinExp1 = await handleExperienceGain({
      pokemon: winnerPokemon1,
      targetPokemon: loserPokemon1,
      divide: true,
    })
  }

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

  const afterMessage = `*${updatedWinnerPlayer.name}* vence o duelo e recebe +${eloGain} pontos de ranking e +${cashGain} POKECOINS.
*${updatedLoserPlayer.name}* perdeu ${eloLose} pontos de ranking.
${levelDiffMessage}
${winnerLevelUpMessage0}
${winnerLevelUpMessage1}
${loserLevelUpMessage0}
${loserLevelUpMessage1}`

  return {
    message: `${session.creator.name} enfrenta ${session.invited.name} em um duelo duplo!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    isAnimated: true,
  }
}
