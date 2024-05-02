import prisma from '../../../../../../prisma-provider/src'
import { bossInvasionLootMap } from '../../../../server/constants/bossInvasionLootMap'
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

export const bossInvasion = async (data: TRouteParams): Promise<IResponse> => {
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
  if (invasionSession.enemyPokemons.length !== 1) throw new UnexpectedError('Não há 1 pokemon inimigo.')

  const players = invasionSession.lobbyPlayers

  for (const player of players) {
    if (!player.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player.name)
  }
  const allyTeam = players.map(player => player.teamPoke1!)

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
    leftTeam: allyTeam,
    rightTeam: [invasionSession.enemyPokemons[0]],
    wildBattle: true,
    staticImage: true,
  })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')
  if (!duel.winnerTeam) throw new NoDuelWinnerFoundError()
  if (!duel.loserTeam) throw new NoDuelLoserFoundError()

  if (allyTeam.map(ally => ally.id).includes(duel.loserTeam[0].id)) {
    return await handleInvasionLose({
      duel,
      players,
      invasionSession,
    })
  }

  const cashReward = invasionSession.cashReward || 0

  await prisma.player.updateMany({
    where: {
      OR: players.map(player => {
        return { id: player.id }
      }),
    },
    data: {
      cash: {
        increment: cashReward,
      },
    },
  })

  const expGainDisplayMessagesObject: string[] = []

  for (const player of players) {
    const response = await handleExperienceGain({
      pokemon: player.teamPoke1!,
      targetPokemon: invasionSession.enemyPokemons[0],
    })
    if (response.leveledUp) {
      expGainDisplayMessagesObject.push(
        `*${player.teamPoke1!.baseData.name}* subiu para o nível ${player.teamPoke1!.level}! \n`
      )
    }
  }

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

  const boss = invasionSession.enemyPokemons[0]

  const lootData = bossInvasionLootMap.get(boss.baseData.name)
  const shinyMultipler = boss.isShiny ? 1.5 : 1

  const lootMessages: string[] = []

  if (lootData) {
    for (const player of players) {
      const lootArray: string[] = []
      for (const loot of lootData) {
        if (Math.random() * shinyMultipler < loot.dropChance) {
          lootArray.push(loot.itemName)
          const item = await prisma.item.findFirst({
            where: {
              ownerId: player.id,
              name: loot.itemName,
            },
          })
          if (item) {
            await prisma.item.update({
              where: {
                id: item.id,
              },
              data: {
                amount: {
                  increment: 1,
                },
              },
            })
          } else {
            await prisma.item.create({
              data: {
                ownerId: player.id,
                name: loot.itemName,
                amount: 1,
              },
            })
          }
        }
      }
      if (Math.random() * shinyMultipler < 0.15) {
        const bonusItems = ['sun-stone', 'dusk-stone', 'dawn-stone', 'shiny-stone', 'moon-stone']
        const itemName = bonusItems[Math.floor(Math.random() * bonusItems.length)]
        const item = await prisma.item.findFirst({
          where: {
            ownerId: player.id,
            name: itemName,
          },
        })
        if (item) {
          await prisma.item.update({
            where: {
              id: item.id,
            },
            data: {
              amount: {
                increment: 1,
              },
            },
          })
        } else {
          await prisma.item.create({
            data: {
              ownerId: player.id,
              name: itemName,
              amount: 1,
            },
          })
        }
      }

      if (lootArray.length > 1) {
        lootMessages.push(`${player.name} obteve: ${lootArray.join(', ')}.`)
        continue
      }
      if (lootArray.length > 0) lootMessages.push(`${player.name} obteve: ${lootArray.flat()}.`)
    }
  }

  const afterMessage = `*${players.map(p => p.name).join(' e ')}* vencem a invasão e recebem $${cashReward} POKECOINS!.

${duel.damageDealtMessage}
${expGainDisplayMessagesObject}
${lootMessages.join(' \n')}
`

  return {
    message: `*${players.map(p => p.name).join(' e ')}*enfrentam ${invasionSession.name}!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    afterMessageDelay: 10000,
    isAnimated: false,
  }
}

type THandleInvasionLoseData = {
  players: DuelPlayer[]
  duel: TDuelNXNResponse
  invasionSession: InvasionSession
}

const handleInvasionLose = async (data: THandleInvasionLoseData) => {
  const { players, duel, invasionSession } = data

  const cashLose = Math.round((invasionSession.cashReward || 0) * 0.33)

  await prisma.player.updateMany({
    where: {
      OR: players.map(player => {
        return { id: player.id }
      }),
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
    message: `*${players.map(p => p.name).join(' e ')}* enfrentam ${invasionSession.name}!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage: `*${players.map(p => p.name).join(' e ')}* foram derrotados e perderam $${cashLose}.`,
    afterMessageDelay: 7,
    isAnimated: false,
  }
}
