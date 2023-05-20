import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
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

  if (!player)
    return {
      message: 'ERROR: No player found with code ' + data.playerPhone,
      status: 400,
      data: null,
    }

  const numberPage = () => {
    if (typeof Number(page) === 'number') return Number(page)
    return 0
  }

  const imageUrl = await iGenInvetoryPokemons({
    playerData: player,
    page: numberPage(),
  })

  return {
    message: `Página ${numberPage() + 1} de Pokemons de ${player.name}.`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
