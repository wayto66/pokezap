import { MissingParametersRouteRouteError, SubRouteNotFoundError } from 'infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { routeEnter } from './enter/routeEnter'
import { routeInfo } from './info/routeInfo'
import { routeStart } from './start/routeStart'

const routesMap = new Map<string, any>([
  // ROUTE ENTER ROUTES
  ['ENTRAR', routeEnter],
  ['ENTER', routeEnter],

  // ROUTE LEAVE ROUTES
  ['SAIR', undefined],
  ['LEAVE', undefined],
  ['QUIT', undefined],
  ['EXIT', undefined],
  ['UPGRADE', undefined],

  // ROUTE INFO ROUTES
  ['INFO', routeInfo],

  // ROUTE START ROUTES
  ['START', routeStart],
  ['INICIO', routeStart],
  ['INICIAR', routeStart],
])

export const routeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersRouteRouteError()

  const route = routesMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
