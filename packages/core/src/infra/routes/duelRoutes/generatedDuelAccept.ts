import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { ContinuousDuel6x6 } from '../../../server/modules/duel/ContinuousDuel6x6'
import { BasePokemon, Player, Pokemon, Skill } from '../../../types/prisma'
import {
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export type DuelPokemon = Pokemon & {
  baseData: BasePokemon & {
    skills: Skill[]
  }
}

export type DuelPlayer = Player & {
  teamPoke1: DuelPokemon | null
}

const include = {
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
}

export const generatedDuelAccept = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , sessionIdString, fast] = data.routeParams
  const sessionId = Number(sessionIdString)
  if (typeof sessionId !== 'number') throw new TypeMissmatchError(sessionIdString, 'number')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
    },
    include: {
      creator: {
        include,
      },
      invited: {
        include,
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

  if (!session.creatorAccepted && !session.invitedAccepted) {
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        [player.id === session.creatorId ? 'creatorAccepted' : 'invitedAccepted']: true,
      },
    })
    return {
      message: `*${player.name}* está pronto para o duelo!`,
      status: 200,
    }
  }

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

  const players = new Map<number, DuelPlayer>([
    [session.creator.id, session.creator],
    [session.invited.id, session.invited],
  ])
  const winner = players.get(winnerId)
  const loser = players.get(loserId)

  if (!winner) throw new PlayerNotFoundError(winnerId.toString())
  if (!loser) throw new PlayerNotFoundError(loserId.toString())

  if (!winner.teamPoke1) throw new UnexpectedError('NOTEAMPOKE1')
  if (!loser.teamPoke1) throw new UnexpectedError('NOTEAMPOKE1')

  const afterMessage = `*${winner.name}* vence o duelo!

${duel.damageDealtMessage}`

  return {
    message: `*${session.creator.name}* enfrenta *${session.invited.name}*!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    isAnimated: !staticImage,
  }
}
