import { MissingParametersRouteRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { routeEnter } from './enter/routeEnter'
import { routeIncense } from './incense/routeIncense'
import { routeInfo } from './info/routeInfo'
import { routeExit } from './routeExit'
import { routeStart } from './start/routeStart'
import { routeLock } from './lock/routeLock'

const routesMap = new Map<string, any>([
  // ROUTE ENTER ROUTES
  ['ENTRAR', routeEnter],
  ['ENTER', routeEnter],

  // ROUTE LEAVE ROUTES
  ['SAIR', routeExit],
  ['LEAVE', routeExit],
  ['QUIT', routeExit],
  ['EXIT', routeExit],
  ['UPGRADE', routeExit],

  // ROUTE INFO ROUTES
  ['INFO', routeInfo],

  // ROUTE START ROUTES
  ['START', routeStart],
  ['INICIO', routeStart],
  ['INICIAR', routeStart],

  // ROUTE USE INCENSE
  ['INCENSE', routeIncense],
  ['INCENSO', routeIncense],

  // ROUTE LOCK
  ['LOCK', routeLock],
  ['TRAVAR', routeLock],
])

export const routeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersRouteRouteError()

  const route = routesMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
