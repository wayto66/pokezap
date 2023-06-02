import { InvasionSession, PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  InsufficentPlayersForInvasionError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { IResponse } from '../../../../server/models/IResponse'
import { TRouteParams } from '../../router'
import { handleExperienceGain } from '../../../../server/modules/pokemon/handleExperienceGain'
import { TDuelX2Response } from '../../../../server/modules/duel/duelX2'
import { DuelPlayer } from '../../../../infra/routes/duelRoutes/duelAccept'
import { duelNX1 } from '../../../../server/modules/duel/duelNX1'
import { bossInvasionLootMap } from '../../../../server/constants/bossInvasionLootMap'

export const bossInvasion = async (data: TRouteParams): Promise<IResponse> => {
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
  if (invasionSession.enemyPokemons.length !== 1) throw new UnexpectedError('Não há 1 pokemon inimigo.')

  const players = invasionSession.lobbyPlayers

  for (const player of players) {
    if (!player.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player.name)
  }
  const allyTeam = players.map(player => player.teamPoke1!)

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

  const duel = await duelNX1({
    playerTeam: allyTeam,
    boss: invasionSession.enemyPokemons[0],
  })

  console.log({ duel })

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

  await prismaClient.player.updateMany({
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

  const boss = invasionSession.enemyPokemons[0]

  const lootData = bossInvasionLootMap.get(boss.baseData.name)
  const shinyMultipler = boss.isShiny ? 1.5 : 1

  const lootMessages: string[] = []
  console.log({ lootData })

  if (lootData) {
    for (const player of players) {
      const lootArray: string[] = []
      for (const loot of lootData) {
        if (Math.random() * shinyMultipler < loot.dropChance) {
          lootArray.push(loot.itemName)
          let item = await prismaClient.item.findFirst({
            where: {
              ownerId: player.id,
              name: loot.itemName,
            },
          })
          if (item) {
            await prismaClient.item.update({
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
            await prismaClient.item.create({
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
        const bonusItems = ['sun-stone', 'dusk-stone', 'dawn-stone', 'shiny-stone']
        const itemName = bonusItems[Math.floor(Math.random() * bonusItems.length)]
        let item = await prismaClient.item.findFirst({
          where: {
            ownerId: player.id,
            name: itemName,
          },
        })
        if (item) {
          await prismaClient.item.update({
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
          await prismaClient.item.create({
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
    isAnimated: true,
  }
}

type THandleInvasionLoseData = {
  players: DuelPlayer[]
  duel: TDuelX2Response
  invasionSession: InvasionSession
}

const handleInvasionLose = async (data: THandleInvasionLoseData) => {
  const { players, duel, invasionSession } = data
  const prisma = container.resolve<PrismaClient>('PrismaClient')

  const cashLose = Math.round((invasionSession.cashReward || 0) * 0.5)

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
    isAnimated: true,
  }
}
