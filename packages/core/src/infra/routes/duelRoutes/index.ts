import prisma from '../../../../../prisma-provider/src'
import {
  MissingParametersDuelRouteError,
  RouteNotFoundError,
  SubRouteNotFoundError,
} from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { duelAccept } from './duelAccept'
import { duelAcceptX2 } from './duelAcceptX2'
import { duelAcceptX6 } from './duelAcceptX6'
import { duelRandom } from './duelRandom'
import { duelX1Route } from './duelX1Route'
import { duelX2Route } from './duelX2Route'
import { duelX6Route } from './duelX6Route'
import { generatedDuelAccept } from './generatedDuelAccept'

const subRouteMap = new Map<string, any>([
  // DUEL X1 ROUTES
  ['X1', duelX1Route],

  // DUEL X2 ROUTES
  ['X2', duelX2Route],

  ['X6', duelX6Route],

  // DUEL ACCEPT ROUTES
  ['ACCEPTX1', duelAccept],
  ['ACCEPTX2', duelAcceptX2],
  ['ACCEPTX6', duelAcceptX6],
  ['GENERATED-ACCEPT', generatedDuelAccept],

  // DUEL RANDOM
  ['RANDOM', duelRandom],
])

export const duelRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const gameRoom = await prisma.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })
  if (!gameRoom) throw new RouteNotFoundError('', '')
  // if (gameRoom.mode !== 'duel-raid') throw new RouteForbiddenForDuelRaidError()

  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersDuelRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
