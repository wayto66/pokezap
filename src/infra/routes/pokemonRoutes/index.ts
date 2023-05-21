import { MissingParametersPokemonRouteError, SubRouteNotFoundError } from 'infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { pokemonInfo1 } from './info/pokemonInfo1'
import { pokemonTeam } from './team/pokemonTeam'

const subRouteMap = new Map<string, any>([
  // POKEMON INFO ROUTES
  ['INFO', pokemonInfo1],

  // POKEMON TEAM ROUTES
  ['TEAM', pokemonTeam],
  ['TIME', pokemonTeam],
  ['EQUIPE', pokemonTeam],
])

export const pokemonRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersPokemonRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
