import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { pokemonInfo1 } from './info/pokemonInfo1'
import { pokemonTeam } from './team/pokemonTeam'

const subRouteMap = new Map<string, any>([
  ['INFO', pokemonInfo1],
  ['TEAM', pokemonTeam],
  ['TIME', pokemonTeam],
  ['EQUIPE', pokemonTeam],
])

export const pokemonRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams

  if (subRoute) {
    const route = subRouteMap.get(subRoute)
    if (!route) {
      return {
        message: 'ERROR: no route found for subroutename: ' + subRoute,
        status: 400,
        data: null,
      }
    }

    return await route(data)
  }

  return {
    message: 'DUMMY: This is the pokemon route, specify a sub route.',
    status: 300,
    data: null,
  }
}
