import { MissingParametersRouteRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { daycareRoutes } from './daycare'
import { routeEnter } from './enter/routeEnter'
import { routeForfeit } from './forfeit/routeForfeit'
import { routeIncense } from './incense/routeIncense'
import { routeInfo } from './info/routeInfo'
import { routeLock } from './lock/routeLock'
import { pokeranchRoute } from './pokeranch/pokeranchRoute'
import { routeExit } from './routeExit'
import { shipRoute } from './ship/shipRoute'
import { routeStart } from './start/routeStart'
import { routeUpgrade } from './upgrade/routeUpgrade'
import { routeVerify } from './verify/routeVerify'

const routesMap = new Map<string, (data: TRouteParams) => Promise<IResponse>>([
  // ROUTE ENTER ROUTES
  ['ENTRAR', routeEnter],
  ['ENTER', routeEnter],

  // ROUTE LEAVE ROUTES
  ['SAIR', routeExit],
  ['LEAVE', routeExit],
  ['QUIT', routeExit],
  ['EXIT', routeExit],

  // ROUTE UPGRADE ROUTES
  ['UPGRADE', routeUpgrade],

  // ROUTE INFO ROUTES
  ['INFO', routeInfo],
  ['INDO', routeInfo],

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

  // POKE-RANCH ROUTES
  ['POKE-RANCH', pokeranchRoute],
  ['POKE-RANCHO', pokeranchRoute],
  ['POKERANCH', pokeranchRoute],
  ['POKERANCHO', pokeranchRoute],

  // DAYCARE ROUTES
  ['DAY-CARE', daycareRoutes],
  ['DAYCARE', daycareRoutes],

  // TRAVEL ROUTES
  ['TRAVEL', shipRoute],
  ['VIAJAR', shipRoute],
  ['VIAGEM', shipRoute],
])

export const routeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersRouteRouteError()

  const route = routesMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
