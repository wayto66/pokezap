import { IResponse } from '../../../server/models/IResponse'
import { MissingParametersMarketRouteError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { duelX1Generate } from './duelX1Generate'

const subRouteMap = new Map<string, any>([['DUEL', duelX1Generate]])

export const admRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!['5516988675837@c.us', '5516981453197@c.us'].includes(data.playerPhone))
    return {
      react: '💤',
      message: '',
      status: 300,
    }
  if (!subRoute) throw new MissingParametersMarketRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
