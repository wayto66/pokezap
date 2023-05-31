import { MissingParametersDuelRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { duelAccept } from './duelAccept'
import { duelAcceptX2 } from './duelAcceptX2'
import { duelX1Route } from './duelX1Route'
import { duelX2Route } from './duelX2Route'

const subRouteMap = new Map<string, any>([
  // DUEL X1 ROUTES
  ['X1', duelX1Route],

  // DUEL X2 ROUTES
  ['X2', duelX2Route],

  // DUEL ACCEPT ROUTES
  ['ACCEPTX1', duelAccept],
  ['ACCEPTX2', duelAcceptX2],
])

export const duelRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersDuelRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
