import {
  MissingParameterError,
  MissingParametersInventoryRouteError,
  SubRouteNotFoundError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { cassinoTrade } from './casinoTrade'

const subRouteMap = new Map<string, any>([
  ['TRADE', cassinoTrade],
  ['PLAY', cassinoTrade],
  ['JOGAR', cassinoTrade],
])

export const casinoRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParameterError('Ação')

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
