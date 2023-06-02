import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { InvasionNotFoundError, RouteNotFoundError, UnexpectedError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokeBossInvasion } from '../../../../server/modules/imageGen/iGenPokeBossInvasion'
import { MessageMedia } from 'whatsapp-web.js'

export const routeVerify = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (!route) throw new RouteNotFoundError(data.playerName, data.groupCode)

  if (!route.invasorId)
    return {
      message: `Tudo tranquilo na rota ${route.id}.`,
      status: 200,
      data: null,
    }

  const invasionSession = await prismaClient.invasionSession.findFirst({
    where: {
      id: route.invasorId,
    },
    include: {
      enemyPokemons: {
        include: {
          baseData: true,
        },
      },
    },
  })

  if (!invasionSession) throw new InvasionNotFoundError(route.invasorId)
  if (!invasionSession.enemyPokemons) throw new UnexpectedError('no enemies on route invasion')
  if (invasionSession.isFinished) throw new UnexpectedError('finished invasion still registered on route.')

  if (invasionSession.mode === 'boss-invasion') {
    const imageUrl = await iGenPokeBossInvasion({
      invasionSession,
      pokeBoss: invasionSession.enemyPokemons[0],
    })
    const media = MessageMedia.fromFilePath(imageUrl)

    return {
      message: `${invasionSession.announcementText}
  
      👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
  `,
      status: 200,
      data: null,
      imageUrl,
      actions: [`pz. invasion defend ${invasionSession.id}`],
    }
  }

  throw new UnexpectedError('unsupported invasion mode.')
}
