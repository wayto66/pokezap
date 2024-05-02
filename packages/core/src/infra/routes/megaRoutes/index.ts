import { MissingParametersTradeRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { megaEvolve } from './megaEvolve'
import { megaRevert } from './megaRevert'

const routesMap = new Map<string, any>([
  ['EVOLVE', megaEvolve],
  ['EVOLUIR', megaEvolve],
  ['REVERT', megaRevert],
  ['REVERTER', megaRevert],
])

export const megaRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRouteName] = data.routeParams
  if (!subRouteName) throw new MissingParametersTradeRouteError()

  const route = routesMap.get(subRouteName)
  if (!route) throw new SubRouteNotFoundError(subRouteName)

  return await route(data)
}
