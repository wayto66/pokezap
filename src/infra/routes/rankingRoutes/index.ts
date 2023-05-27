import { MissingParametersRankRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { catchRanking } from './catchRanking'
import { eloRanking } from './eloRanking'

const routesMap = new Map<string, any>([
  // ELO RANKING ROUTES
  ['ELO', eloRanking],
  ['RANK', eloRanking],
  ['RANKING', eloRanking],
  ['MMR', eloRanking],

  // CATCH RANKING ROUTES
  ['CAPTURA', catchRanking],
  ['CAPTURAS', catchRanking],
  ['CATCH', catchRanking],
  ['CATCHES', catchRanking],
])

export const rankRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersRankRouteError()

  const route = routesMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
