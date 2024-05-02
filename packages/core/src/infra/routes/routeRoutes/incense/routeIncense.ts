import prisma from '../../../../../../prisma-provider/src'
import { pokemonTypes } from '../../../../server/constants/pokemonTypes'
import { IResponse } from '../../../../server/models/IResponse'
import {
  PlayerDoesNotHaveItemError,
  PlayerNotFoundError,
  RouteHasADifferentIncenseActiveError,
  RouteNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const routeIncense = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , givenIncenseName, element1, element2, element3, element4, element5, element6] = data.routeParams

  const incenseName = (givenIncenseName || 'full-incense').toLowerCase()

  const elementsPre = [element1, element2, element3, element4, element5, element6]
  const elements: string[] = []

  for (const element of elementsPre) {
    if (!element || typeof element !== 'string') continue
    if (!pokemonTypes.includes(element.toLowerCase())) throw new UnexpectedError('Não há um tipo chamado: ' + element)
    if (incenseName === 'elemental-incense') elements.push(element.toLowerCase())
  }

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  const incenseItem = await prisma.item.findFirst({
    where: {
      ownerId: player.id,
      baseItem: {
        name: incenseName,
      },
    },
  })

  const route = await prisma.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!incenseItem || incenseItem.amount <= 0) throw new PlayerDoesNotHaveItemError(player.name, incenseName)
  if (route.activeIncense !== incenseName && route.incenseCharges && route.incenseCharges > 0)
    throw new RouteHasADifferentIncenseActiveError(incenseName)

  const updatedRoute = await prisma.gameRoom.update({
    where: {
      phone: data.groupCode,
    },
    data: {
      activeIncense: incenseName,
      incenseCharges: {
        increment: 10,
      },
      incenseElements: {
        set: elements,
      },
    },
  })

  await prisma.item.update({
    where: {
      id: incenseItem.id,
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  })

  return {
    message: `*${player.name}* ativou um incenso na *ROTA ${updatedRoute.id}!*`,
    status: 200,
    data: null,
  }
}
