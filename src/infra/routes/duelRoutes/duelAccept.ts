import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { duelX1 } from '../../../server/modules/duel/duelX1'
import { TRouteParams } from '../router'
import {
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  SendEmptyMessageError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from 'infra/errors/AppErrors'

export const duelAccept = async (data: TRouteParams): Promise<IResponse> => {
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
        },
      },
    },
  })
  if (!session || session.isFinished) throw new SessionIdNotFoundError(sessionId)
  if (!session.creator.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name)
  if (!session.invited.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name)

  if (session.invitedId !== player2.id) throw new SendEmptyMessageError()

  const duelResult = await duelX1({
    poke1: session.creator.teamPoke1,
    poke2: session.invited.teamPoke1,
  })

  if (!duelResult) throw new UnexpectedError('duelo')

  return {
    message: duelResult.message,
    status: 200,
    data: null,
  }
}
