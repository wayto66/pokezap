import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { shopBuy } from './shopBuy'
import { shopDisplay } from './shopDisplay'

export const shopRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , itemIdString] = data.routeParams

  if (itemIdString) return await shopBuy(data)
  return await shopDisplay(data)
}
