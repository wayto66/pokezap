import { MissingParametersMarketRouteError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { marketAnnounce } from './marketAnnounce'
import { marketOffers } from './marketOffers'
import { marketAccept } from './marketAccept'

const subRouteMap = new Map<string, any>([
  ['ANNOUNCE', marketAnnounce],
  ['ANOUNCE', marketAnnounce],
  ['ANUNCIAR', marketAnnounce],

  ['OFFER', marketOffers],
  ['OFFERS', marketOffers],
  ['CHECK', marketOffers],
  ['OFERTAS', marketOffers],

  ['ACCEPT', marketAccept],
  ['ACEITAR', marketAccept],
  ['ACEPT', marketAccept],
])

export const marketRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersMarketRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
