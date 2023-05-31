import { MissingParametersInventoryRouteError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'

const clanText = `PokeZap Wiki: *CLANS*
[Monte seu time com 6 pokemons de um clã para receber bonus!]

- VOLCANIC: fire + ground
- TOXIBUG: poison + bug
- GARDESTRIKE: normal + fighting
- MASTERMIND: dark + psychic + ghost
- SEAVELL: ice + water
- WINGEON: dragon + flying
- WONDERLEAF: grass + fairy
- THUNDERFORGE: steel + rock + electric
`

const subRouteMap = new Map<string, any>([
  // INVENTORY ITEMS ROUTES
  ['CLAN', clanText],
  ['CLANS', clanText],
])

export const helpRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersInventoryRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return {
    message: route,
    status: 200,
    data: null,
  }
}
