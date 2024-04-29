import { MissingParametersMarketRouteError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { npcMarketOffers } from '../../../server/serverActions/cron/npcMarketOffers'

const subRouteMap = new Map<string, any>([['NMO', npcMarketOffers]])

export const admRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersMarketRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  await route()

  return {
    message: '',
    react: '👌',
    status: 200,
  }
}
