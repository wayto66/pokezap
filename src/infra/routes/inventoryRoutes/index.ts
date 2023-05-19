import { IResponse } from "server/models/IResponse"
import { TRouteParams } from "../router"
import { inventoryItems1 } from "./items/inventoryItems1"
import { inventoryPokemons1 } from "./pokemons/inventoryPokemons1"

const subRouteMap = new Map<string, any>([
  ["ITEM", inventoryItems1],
  ["ITEMS", inventoryItems1],
  ["ITEN", inventoryItems1],
  ["ITENS", inventoryItems1],
  ["POKEMONS", inventoryPokemons1],
  ["POKEMON", inventoryPokemons1],
  ["POKES", inventoryPokemons1],
  ["POKE", inventoryPokemons1],
])

export const inventoryRoutes = async (
  data: TRouteParams
): Promise<IResponse> => {
  const [command, route, subRoute] = data.routeParams

  if (subRoute) {
    const route = subRouteMap.get(subRoute)
    if (!route) {
      return {
        message: "ERROR: no route found for subroutename: " + subRoute,
        status: 400,
        data: null,
      }
    }

    return await route(data)
  }

  return {
    message: "DUMMY: This is the inventory route, specify a sub route.",
    status: 300,
    data: null,
  }
}
