import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { iGenDuelX1 } from '../../../server/modules/imageGen/iGenDuelX1'
import { TRouteParams } from '../router'

export const duelX1Route = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , challengedPlayerIdString] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const challengedPlayerId = Number(challengedPlayerIdString)

  if (typeof challengedPlayerId !== 'number')
    return {
      message: `ERRO: "${challengedPlayerIdString}" não é do tipo número.`,
      status: 400,
      data: null,
    }

  const player1 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
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
    },
  })
  const player2 = await prismaClient.player.findFirst({
    where: {
      id: challengedPlayerId,
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
    },
  })

  if (!player1)
    return {
      message: `ERRO: Nenhum jogador encontrado com codigo: "${data.playerPhone}" `,
      status: 400,
      data: null,
    }

  if (!player2)
    return {
      message: `ERRO: Nenhum pokemon encontrado com id: "${challengedPlayerId}" `,
      status: 400,
      data: null,
    }

  if (!player1.teamPoke1) {
    return {
      message: `ERRO: Jogador *${player1.name}* não possui um pokemon em seu time. `,
      status: 400,
      data: null,
    }
  }
  if (!player2.teamPoke1) {
    return {
      message: `ERRO: Jogador *${player2.name}* não possui um pokemon em seu time. `,
      status: 400,
      data: null,
    }
  }

  const newSession = await prismaClient.session.create({
    data: {
      mode: 'duel-x1',
      creatorId: player1.id,
      invitedId: player2.id,
    },
  })

  const imageUrl = await iGenDuelX1({
    player1: player1,
    player2: player2,
  })

  return {
    message: `${player1.name} desafia ${player2.name} para um duelo!
    👍 - Aceitar`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pz. duel accept ${newSession.id}`],
  }
}
