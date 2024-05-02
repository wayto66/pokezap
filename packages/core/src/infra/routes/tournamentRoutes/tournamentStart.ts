import { Player } from '@prisma/client'
import { UnexpectedError } from '../../errors/AppErrors'
import { logger } from '../../logger'
import { TRouteParams } from '../router'
import { tournamentDuel } from './tournamentDuel'

export const tournamentStart = async (data: TRouteParams): Promise<any> => {
  const [, , , gameRoomIdString] = data.routeParams

  const gameRoomId = Number(gameRoomIdString)

  logger.info('start torneio')

  if (isNaN(gameRoomId)) throw new UnexpectedError('gameRoomIdString must be a number')

  const tournament = await prisma.tournament.findFirst({
    where: {
      gameroomId: gameRoomId,
      active: false,
    },
    include: {
      gymLeader: {
        include: {
          pokemons: {
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
      activePlayers: {
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
          teamPoke3: {
            include: {
              baseData: {
                include: {
                  skills: true,
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
            },
          },
          teamPoke5: {
            include: {
              baseData: {
                include: {
                  skills: true,
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
            },
          },
        },
      },
    },
  })

  if (!tournament) throw new UnexpectedError('no tournament found')
  if (tournament.activePlayers.length < 2) throw new UnexpectedError('insufficient players')

  const duelPairs: { p1: Player; p2: Player }[] = []
  let players = [...tournament.activePlayers]

  let tryCount = 0
  while (players.length > 0) {
    if (players.length === 1) {
      break
    }
    tryCount++
    const indexP1 = Math.floor(Math.random() * players.length)
    const p1 = players[indexP1]
    players = players.filter(p => p.id !== p1.id)

    const indexP2 = Math.floor(Math.random() * players.length)
    const p2 = players[indexP2]
    players = players.filter(p => p.id !== p2.id)

    duelPairs.push({ p1, p2 })

    if (tryCount > 100) throw new UnexpectedError('Erro ao sortear confrontos do torneio')
  }

  const { p1, p2 } = duelPairs[0]

  const pairIds = duelPairs
    .slice(1, 999999)
    .map(pair => [pair.p1.id.toString(), pair.p2.id.toString()])
    .flat()

  tournamentDuel({
    ...data,
    routeParams: ['pz', 'tournament', 'duel', tournament.id.toString(), p1.id.toString(), p2.id.toString(), ...pairIds],
  })
}
