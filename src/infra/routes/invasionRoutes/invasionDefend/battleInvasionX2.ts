import { InvasionSession, PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { DuelPlayer } from '../../../../infra/routes/duelRoutes/duelAccept'
import { IResponse } from '../../../../server/models/IResponse'
import { TDuelX2Response, duelX2 } from '../../../../server/modules/duel/duelX2'
import { handleExperienceGain } from '../../../../server/modules/pokemon/handleExperienceGain'
import {
  InsufficentPlayersForInvasionError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const battleInvasionX2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , invasionSessionIdString] = data.routeParams
  const invasionSessionId = Number(invasionSessionIdString)
  if (typeof invasionSessionId !== 'number') throw new TypeMissmatchError(invasionSessionIdString, 'number')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const invasionSession = await prismaClient.invasionSession.findFirst({
    where: {
      id: invasionSessionId,
    },
    include: {
      lobbyPlayers: {
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
        },
      },
      enemyPokemons: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
        },
      },
    },
  })

  if (!invasionSession || invasionSession.isFinished) throw new SessionIdNotFoundError(invasionSessionId)
  if (invasionSession.lobbyPlayers.length !== invasionSession.requiredPlayers)
    throw new InsufficentPlayersForInvasionError(invasionSession.lobbyPlayers.length, invasionSession.requiredPlayers)
  if (invasionSession.enemyPokemons.length !== 2) throw new UnexpectedError('Não há 2 pokemon inimigos.')

  const player1 = invasionSession.lobbyPlayers[0]
  const player2 = invasionSession.lobbyPlayers[1]

  if (!player1.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player1.name)
  if (!player2.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player2.name)

  await prismaClient.invasionSession.update({
    where: {
      id: invasionSession.id,
    },
    data: {
      inInLobby: false,
      isInProgress: true,
      isFinished: false,
    },
  })

  const duel = await duelX2({
    team1: [player1.teamPoke1, player2.teamPoke1],
    team2: [invasionSession.enemyPokemons[0], invasionSession.enemyPokemons[1]],
  })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')
  if (!duel.winnerTeam) throw new NoDuelWinnerFoundError()
  if (!duel.loserTeam) throw new NoDuelLoserFoundError()

  if ([player1.teamPoke1.id, player2.teamPoke1.id].includes(duel.loserTeam[0].id)) {
    return await handleInvasionLose({
      duel,
      player1,
      player2,
      invasionSession,
    })
  }

  const cashReward = invasionSession.cashReward || 0

  await prismaClient.player.updateMany({
    where: {
      OR: [{ id: player1.id }, { id: player2.id }],
    },
    data: {
      cash: {
        increment: cashReward,
      },
    },
  })

  const player1ExpGain = await handleExperienceGain({
    pokemon: player1.teamPoke1,
    targetPokemon: invasionSession.enemyPokemons[0],
  })

  const player2ExpGain = await handleExperienceGain({
    pokemon: player2.teamPoke1,
    targetPokemon: invasionSession.enemyPokemons[1],
  })

  await prismaClient.invasionSession.update({
    where: {
      id: invasionSession.id,
    },
    data: {
      isInProgress: false,
      inInLobby: false,
      isFinished: true,
    },
  })

  await prismaClient.gameRoom.update({
    where: {
      id: invasionSession.gameRoomId,
    },
    data: {
      invasor: {
        disconnect: true,
      },
    },
  })

  const player1LevelUpMessage0 = player1ExpGain.leveledUp
    ? `*${player1.teamPoke1.baseData.name}* subiu para o nível ${player1.teamPoke1.level}!`
    : ''
  const player2LevelUpMessage0 = player2ExpGain.leveledUp
    ? `*${player2.teamPoke1.baseData.name}* subiu para o nível ${player2.teamPoke1.level}!`
    : ''

  const afterMessage = `*${player1.name}* e ${player2.name} vencem a invasão e recebem $${cashReward} POKECOINS!.
${player1LevelUpMessage0}
${player2LevelUpMessage0}
`

  return {
    message: `*${player1.name}* e *${player2.name}* enfrentam ${invasionSession.name}!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    isAnimated: true,
  }
}

type THandleInvasionLoseData = {
  player1: DuelPlayer
  player2: DuelPlayer
  duel: TDuelX2Response
  invasionSession: InvasionSession
}

const handleInvasionLose = async (data: THandleInvasionLoseData) => {
  const { player1, player2, invasionSession } = data
  const prisma = container.resolve<PrismaClient>('PrismaClient')

  const cashLose = (invasionSession.cashReward || 0) * 1.5

  await prisma.player.updateMany({
    where: {
      OR: [{ id: player1.id }, { id: player2.id }],
    },
    data: {
      cash: {
        decrement: cashLose,
      },
    },
  })

  await prisma.invasionSession.update({
    where: {
      id: invasionSession.id,
    },
    data: {
      lobbyPlayers: {
        set: [],
      },
      isFinished: false,
      isInProgress: false,
      inInLobby: true,
    },
  })

  return {
    message: `*${player1.name}* e *${player2.name}* foram derrotados e perderam $${cashLose}.`,
    status: 200,
    data: null,
  }
}
