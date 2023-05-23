import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenInvetoryPokemons } from '../../../../server/modules/imageGen/iGenInvetoryPokemons'

export const inventoryPokemons1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , page] = data.routeParams

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: {
        include: {
          baseData: true,
          talent1: true,
          talent2: true,
          talent3: true,
          talent4: true,
          talent5: true,
          talent6: true,
          talent7: true,
          talent8: true,
          talent9: true,
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const numberPage = () => {
    if (typeof Number(page) === 'number' && !isNaN(Number(page))) return Number(page)
    return 1
  }

  const imageUrl = await iGenInvetoryPokemons({
    playerData: player,
    page: numberPage(),
  })

  return {
    message: `Página ${numberPage()} de Pokemons de ${player.name}.`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
