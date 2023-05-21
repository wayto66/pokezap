import { MissingParametersDuelRouteError, SubRouteNotFoundError } from 'infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { duelAccept } from './duelAccept'
import { duelX1Route } from './duelX1Route'

const subRouteMap = new Map<string, any>([
  // DUEL X1 ROUTES
  ['X1', duelX1Route],

  // DUEL ACCEPT ROUTES
  ['ACCEPT', duelAccept],
])

export const duelRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersDuelRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
