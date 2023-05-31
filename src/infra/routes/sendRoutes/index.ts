import { MissingParametersTradeRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { sendCash } from './sendCash'
import { sendPoke } from './sendPoke'

const routesMap = new Map<string, any>([
  ['POKE', sendPoke],
  ['POKEMON', sendPoke],
  ['ITEN', undefined],
  ['ITEM', undefined],
  ['CASH', sendCash],
  ['POKECOIN', sendCash],
  ['POKECOINS', sendCash],
  ['DINHEIRO', sendCash],
])

export const sendRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRouteName] = data.routeParams
  if (!subRouteName) throw new MissingParametersTradeRouteError()

  const route = routesMap.get(subRouteName)
  if (!route) throw new SubRouteNotFoundError(subRouteName)

  return await route(data)
}
