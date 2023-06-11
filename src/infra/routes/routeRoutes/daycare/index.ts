import { IResponse } from '../../../../server/models/IResponse'
import { SubRouteNotFoundError, MissingParameterError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { daycareIn } from './daycareIn'
import { daycareOut } from './daycareOut'
import { daycareInfo } from './daycareInfo'

const subRouteMap = new Map<string, any>([
  // IN ROUTES
  ['IN', daycareIn],
  ['ENTER', daycareIn],
  ['ENTRAR', daycareIn],

  // OUT ROUTES
  ['OUT', daycareOut],
  ['LEAVE', daycareOut],
  ['SAIR', daycareOut],

  // IN ROUTES
  ['INFO', daycareInfo],
])

export const daycareRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParameterError('Ação')

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
