import { IResponse } from '../../../../server/models/IResponse'
import { MissingParameterError, SubRouteNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

const subRouteMap = new Map<string, any>([])

export const ranchRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParameterError('Ação')

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
