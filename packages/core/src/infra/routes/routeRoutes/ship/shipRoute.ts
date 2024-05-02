import prisma from '../../../../../../prisma-provider/src'
import { getHoursDifference } from '../../../../server/helpers/getHoursDifference'
import { sendMessage } from '../../../../server/helpers/sendMessage'
import { IResponse } from '../../../../server/models/IResponse'
import {
  AlreadyTravelingError,
  MissingTravelRegionError,
  RouteDoesNotHaveUpgradeError,
  RouteNotFoundError,
  UpgradeNotFoundError,
  XIsInCooldownError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const shipRoute = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , regionUppercase] = data.routeParams

  const route = await prisma.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      activeWildPokemon: true,
      upgrades: {
        include: {
          base: true,
        },
      },
    },
  })
  if (!route) throw new RouteNotFoundError(data.playerName, data.groupCode)
  if (!route.upgrades.map(upg => upg.base.name).includes('barco')) throw new RouteDoesNotHaveUpgradeError('barco')
  if (!regionUppercase) throw new MissingTravelRegionError()

  const region = regionUppercase.toLowerCase()

  if (!['alola', 'galar', 'return', 'voltar'].includes(region)) throw new MissingTravelRegionError()

  const ship = route.upgrades.find(r => r.base.name === 'barco')
  if (!ship) throw new UpgradeNotFoundError('barco')
  if (ship.lastUse) {
    const hoursDiff = getHoursDifference(ship.lastUse, new Date())
    if (hoursDiff < 1) throw new AlreadyTravelingError(route.id)
    if (hoursDiff > 1 && hoursDiff < 12) throw new XIsInCooldownError('Barco', (12 - hoursDiff).toFixed(2))
  }

  if (region === 'return') {
    await prisma.gameRoom.update({
      where: {
        id: route.id,
      },
      data: {
        region: null,
      },
    })

    return {
      message: `Treinadores retornaram à rota ${route.id}.`,
      status: 200,
    }
  }

  await prisma.gameRoom.update({
    where: {
      id: route.id,
    },
    data: {
      region: region,
    },
  })

  setTimeout(() => travelReturn({ ...data }), 30 * 60 * 1000)

  return {
    message: `Treinadores da rota ${route.id} à bordo para ${regionUppercase}!`,
    status: 200,
  }
}

const travelReturn = async (data: TRouteParams) => {
  const [, , , regionUppercase] = data.routeParams

  await prisma.gameRoom.updateMany({
    where: {
      phone: data.groupCode,
    },
    data: {
      region: null,
    },
  })

  sendMessage({ chatId: data.groupCode, content: `A viagem à ${regionUppercase} se encerrou.` })
}
