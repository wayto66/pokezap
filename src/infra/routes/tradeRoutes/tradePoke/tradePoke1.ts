import { PrismaClient } from '@prisma/client'
import { ISession } from 'server/models/ISession'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenTradePokemon } from '../../../../server/modules/imageGen/iGenTradePokemon'
import { TRouteParams } from '../../router'
import { tradePoke2 } from './tradePoke2'

export const tradePoke1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , creatorPokeIdString, invitedPokeIdString, confirm, sessionIdString] = data.routeParams
  const creatorPokeId = Number(creatorPokeIdString)
  const invitedPokeId = Number(invitedPokeIdString)
  const sessionId = Number(sessionIdString)
  if (typeof creatorPokeId !== 'number' || isNaN(creatorPokeId))
    return {
      message: `ERRO: "${creatorPokeIdString}" não é do tipo número.`,
      status: 400,
      data: null,
    }
  if (typeof invitedPokeId !== 'number' || isNaN(invitedPokeId))
    return {
      message: `ERRO: "${invitedPokeIdString}" não é do tipo número.`,
      status: 400,
      data: null,
    }

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const requesterPlayer = await prismaClient.player.findUnique({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!requesterPlayer)
    return {
      message: `ERRO: Nenhum jogador encontrado com codigo: "${data.playerPhone}" `,
      status: 400,
      data: null,
    }

  if (data.fromReact && (typeof sessionId !== 'number' || isNaN(sessionId)))
    return {
      message: `ERRO: "${sessionId}" não é do tipo número.`,
      status: 400,
      data: null,
    }

  let session: ISession | undefined | null
  if (confirm === 'CONFIRM' && data.fromReact) {
    session = await prismaClient.session.findUnique({
      where: {
        id: sessionId,
      },
    })
    if (!session)
      return {
        message: `ERRO: Nenhuma sessão de troca encontrada com codigo: "${sessionId}" `,
        status: 400,
        data: null,
      }
    if (session.invitedId !== requesterPlayer.id || session.isFinished) {
      return {
        message: ``,
        status: 400,
        data: null,
        react: '❌',
      }
    }
  }

  const pokes = await prismaClient.pokemon.findMany({
    where: {
      OR: [
        {
          id: creatorPokeId,
        },
        {
          id: invitedPokeId,
        },
      ],
    },
    include: {
      baseData: true,
    },
  })

  const creatorPoke = pokes.find(poke => poke.id === creatorPokeId)
  if (!creatorPoke)
    return {
      message: `ERRO: Nenhum pokemon encontrado com id: "${creatorPokeId}" `,
      status: 400,
      data: null,
    }

  const invitedPoke = pokes.find(poke => poke.id === invitedPokeId)
  if (!invitedPoke)
    return {
      message: `ERRO: Nenhum pokemon encontrado com id: "${invitedPokeId}" `,
      status: 400,
      data: null,
    }

  if (creatorPoke?.ownerId !== requesterPlayer.id && !data.fromReact)
    return {
      message: `ERRO: Pokemon #${creatorPoke.id} ${creatorPoke.baseData.name} não pertence à ${requesterPlayer.name}. `,
      status: 400,
      data: null,
    }

  if (!invitedPoke.ownerId)
    return {
      message: `ERRO: Pokemon #${invitedPoke.id} ${invitedPoke.baseData.name} não possui dono. `,
      status: 400,
      data: null,
    }

  const invitedPlayer = await prismaClient.player.findUnique({
    where: {
      id: invitedPoke.ownerId,
    },
  })

  if (!invitedPlayer)
    return {
      message: `ERRO: Nenhum jogador encontrado com codigo: "${invitedPoke.ownerId}" `,
      status: 400,
      data: null,
    }

  if (confirm == 'CONFIRM' && data.fromReact) {
    if (!session)
      return {
        message: `ERRO: Nenhuma sessão de troca encontrada com codigo: "${sessionId}" `,
        status: 400,
        data: null,
      }
    return await tradePoke2({
      creatorPoke,
      invitedPoke,
      session,
    })
  }

  const newSession = await prismaClient.session.create({
    data: {
      mode: 'poke-trade',
      creatorId: requesterPlayer.id,
      invitedId: invitedPlayer.id,
    },
  })

  const imageUrl = await iGenTradePokemon({
    pokemon1: creatorPoke,
    pokemon2: invitedPoke,
  })

  return {
    message: `${requesterPlayer.name} deseja trocar seu #${creatorPoke.id}-${creatorPoke.baseData.name} com o #${invitedPoke.id}-${invitedPoke.baseData.name} de ${invitedPlayer.name}.
    👍 - Aceitar`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pz. trade poke ${creatorPoke.id} ${invitedPoke.id} confirm ${newSession.id}`],
  }
}
