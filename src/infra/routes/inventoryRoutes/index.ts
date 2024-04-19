import { MissingParametersInventoryRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { inventoryItems1 } from './items/inventoryItems1'
import { inventoryPokemons1 } from './pokemons/inventoryPokemons1'

const subRouteMap = new Map<string, any>([
  // INVENTORY ITEMS ROUTES
  ['ITEM', inventoryItems1],
  ['ITEMS', inventoryItems1],
  ['ITEN', inventoryItems1],
  ['ITENS', inventoryItems1],
  ['I', inventoryItems1],

  // INVENTORY POKEMON ROUTES
  ['POKEMONS', inventoryPokemons1],
  ['POKEMON', inventoryPokemons1],
  ['POKES', inventoryPokemons1],
  ['POKE', inventoryPokemons1],
  ['P', inventoryPokemons1],
])

export const inventoryRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersInventoryRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
