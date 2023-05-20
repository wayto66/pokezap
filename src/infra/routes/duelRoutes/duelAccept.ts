import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { duelX1 } from '../../../server/modules/duel/duelX1'
import { TRouteParams } from '../router'

export const duelAccept = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , sessionIdString] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const sessionId = Number(sessionIdString)

  if (typeof sessionId !== 'number')
    return {
      message: `ERRO: "${sessionIdString}" não é do tipo número.`,
      status: 400,
      data: null,
    }

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

  const player2 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player2)
    return {
      message: 'ERRO: não foi possível encontrar um jogador com o codigo: ' + data.playerPhone,
      status: 400,
      data: null,
    }

  if (!session || session.isFinished)
    return {
      message: 'ERRO: não foi possível encontrar uma sessão de duelo com o id: ' + sessionId,
      status: 400,
      data: null,
    }

  if (session.invitedId !== player2.id)
    return {
      message: '',
      status: 300,
      data: null,
    }

  if (!session.creator.teamPoke1)
    return {
      message: `${session.creator.name} não possui um pokemon no seu time.`,
      status: 300,
      data: null,
    }

  if (!session.invited.teamPoke1)
    return {
      message: `${session.invited.name} não possui um pokemon no seu time.`,
      status: 300,
      data: null,
    }

  const duelResult = await duelX1({
    poke1: session.creator.teamPoke1,
    poke2: session.invited.teamPoke1,
  })

  if (!duelResult)
    return {
      message: `ERRO: ouve um erro inesperado no duelo.`,
      status: 400,
      data: null,
    }

  return {
    message: duelResult.message,
    status: 200,
    data: null,
  }
}
