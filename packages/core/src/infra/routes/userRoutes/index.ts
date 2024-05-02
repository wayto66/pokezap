import { MissingParametersTradeRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { playerInfo1 } from './info/playerInfo1'
import { playerCash } from './playerCash'
import { playerEnergy } from './playerEnergy'

const routesMap = new Map<string, any>([
  ['INFO', playerInfo1],
  ['INDO', playerInfo1],

  ['CASH', playerCash],
  ['ENERGY', playerEnergy],
])

export const playerRoutes = async (data: TRouteParams): Promise<IResponse> => {
  let [, , subRouteName] = data.routeParams
  if (!subRouteName) subRouteName = 'INFO'

  const route = routesMap.get(subRouteName)
  if (!route) throw new SubRouteNotFoundError(subRouteName)

  return await route(data)
}
