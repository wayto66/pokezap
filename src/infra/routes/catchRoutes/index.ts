import { MissingParametersCatchRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { greatballCatch } from './greatball'
import { pokeballCatch } from './pokeball'

const subRouteMap = new Map<string, any>([
  // POKEBALL CATCH ROUTES
  ['POKEBALL', pokeballCatch],
  ['POKEBOLA', pokeballCatch],
  ['PB', pokeballCatch],

  // GREATBALL CATCH ROUTES
  ['GREATBOLA', greatballCatch],
  ['GREATBALL', greatballCatch],
  ['GB', greatballCatch],
])

export const catchRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , pokeballType] = data.routeParams
  if (!pokeballType) throw new MissingParametersCatchRouteError()

  const route = subRouteMap.get(pokeballType)
  if (!route) throw new SubRouteNotFoundError(pokeballType)

  return await route(data)
}
