import { MissingParametersRouteRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { routeEnter } from './enter/routeEnter'
import { routeIncense } from './incense/routeIncense'
import { routeInfo } from './info/routeInfo'
import { routeExit } from './routeExit'
import { routeStart } from './start/routeStart'
import { routeLock } from './lock/routeLock'
import { routeVerify } from './verify/routeVerify'
import { routeForfeit } from './forfeit/routeForfeit'

const routesMap = new Map<string, (data: TRouteParams) => Promise<IResponse>>([
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

  // ROUTE VERIFY
  ['VERIFY', routeVerify],
  ['VERIFICAR', routeVerify],

  // ROUTE FORFEIT
  ['RENDER', routeForfeit],
  ['FORFEIT', routeForfeit],
])

export const routeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersRouteRouteError()

  const route = routesMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
