import { iGenDuelX2 } from '../../../../../image-generator/src/iGenDuelX2'
import prisma from '../../../../../prisma-provider/src'
import {
  CantDuelItselfError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { tournamentNextRound } from './tournamentNextRound'

export const tournamentDuel = async (data: TRouteParams) => {
  const [, , , tournamentIdString, player1IdString, player2IdString, ...pairs] = data.routeParams
  if (!player1IdString || !player2IdString) return await tournamentNextRound(data)
  const player1Id = Number(player1IdString)
  const player2Id = Number(player2IdString)
  const tournamentId = Number(tournamentIdString)
  if (typeof player1Id !== 'number') throw new TypeMissmatchError(player1IdString, 'number')
  if (typeof player2Id !== 'number') throw new TypeMissmatchError(player2IdString, 'number')

  const player1 = await prisma.player.findUnique({
    where: {
      id: player1Id,
    },
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
  })
  if (!player1) throw new PlayerNotFoundError(data.playerPhone)
  if (!player1.teamPoke1 || !player1.teamPoke2) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player1.name)
  if (player1.id === player2Id) throw new CantDuelItselfError()

  const player2 = await prisma.player.findUnique({
    where: {
      id: player2Id,
    },
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
  })
  if (!player2) throw new PlayerNotFoundError(player2IdString)
  if (!player2.teamPoke1 || !player2.teamPoke2) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player2.name)

  const newSession = await prisma.session.create({
    data: {
      mode: 'duel-x6',
      creatorId: player1.id,
      invitedId: player2.id,
    },
  })

  const imageUrl = await iGenDuelX2({
    player1: player1,
    player2: player2,
  })

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: tournamentId,
    },
    include: {
      gameRoom: true,
    },
  })

  const response = {
    message: `*TORNEIO*    
    ${player1.name} enfrenta ${player2.name} em um duelo X6!
    👍 - Aceitar`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pz. tournament duel-accept ${newSession.id} ${tournamentId} ${pairs.join(' ')}`],
  }
}
