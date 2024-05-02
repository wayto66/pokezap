import { MissingParametersTradeRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { tradePoke1 } from './tradePoke/tradePoke1'

const routesMap = new Map<string, any>([
  ['POKE', tradePoke1],
  ['POKEMON', tradePoke1],
  ['ITEN', undefined],
  ['ITEM', undefined],
  ['ITENS', undefined],
  ['ITEMS', undefined],
])

export const tradeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRouteName] = data.routeParams
  if (!subRouteName) throw new MissingParametersTradeRouteError()

  const route = routesMap.get(subRouteName)
  if (!route) throw new SubRouteNotFoundError(subRouteName)

  return await route(data)
}
