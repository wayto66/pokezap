import { MissingParametersInventoryRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { invasionDefendLobbyRoute } from './invasionDefendLobbyRoute'

const subRouteMap = new Map<string, any>([
  // INVASION DEFEND ROUTES
  ['DEFEND', invasionDefendLobbyRoute],
])

export const invasionRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersInventoryRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
