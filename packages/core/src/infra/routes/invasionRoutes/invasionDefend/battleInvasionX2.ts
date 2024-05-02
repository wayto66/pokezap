import prisma from '../../../../../../prisma-provider/src'

import { IResponse } from '../../../../server/models/IResponse'
import { duelNXN } from '../../../../server/modules/duel/duelNXN'

import { handleExperienceGain } from '../../../../server/modules/pokemon/handleExperienceGain'
import { TDuelNXNResponse } from '../../../../types'
import { InvasionSession } from '../../../../types/prisma'
import {
  InsufficentPlayersForInvasionError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { DuelPlayer } from '../../duelRoutes/generatedDuelAccept'
import { TRouteParams } from '../../router'

export const battleInvasionX2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , invasionSessionIdString] = data.routeParams
  const invasionSessionId = Number(invasionSessionIdString)
  if (typeof invasionSessionId !== 'number') throw new TypeMissmatchError(invasionSessionIdString, 'number')

  const invasionSession = await prisma.invasionSession.findFirst({
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
              heldItem: {
                include: {
                  baseItem: true,
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
          heldItem: {
            include: {
              baseItem: true,
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

  await prisma.invasionSession.update({
    where: {
      id: invasionSession.id,
    },
    data: {
      inInLobby: false,
      isInProgress: true,
      isFinished: false,
    },
  })

  const duel = await duelNXN({
    leftTeam: [player1.teamPoke1, player2.teamPoke1],
    rightTeam: [invasionSession.enemyPokemons[0], invasionSession.enemyPokemons[1]],
    wildBattle: true,
    staticImage: true,
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

  await prisma.player.updateMany({
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

  await prisma.invasionSession.update({
    where: {
      id: invasionSession.id,
    },
    data: {
      isInProgress: false,
      inInLobby: false,
      isFinished: true,
    },
  })

  await prisma.gameRoom.update({
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
    isAnimated: false,
  }
}

type THandleInvasionLoseData = {
  player1: DuelPlayer
  player2: DuelPlayer
  duel: TDuelNXNResponse
  invasionSession: InvasionSession
}

const handleInvasionLose = async (data: THandleInvasionLoseData) => {
  const { player1, player2, invasionSession } = data

  const cashLose = Math.round((invasionSession.cashReward || 0) * 1.5)

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
