import { IResponse } from "server/models/IResponse"
import { TRouteParams } from "../router"
import { duelAccept } from "./duelAccept"
import { duelX1Route } from "./duelX1Route"

const subRouteMap = new Map<string, any>([
  ["X1", duelX1Route],
  ["ACCEPT", duelAccept],
])

export const duelRoutes = async (data: TRouteParams): Promise<IResponse> => {
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
    message: "DUMMY: This is the duel route, specify a sub route.",
    status: 300,
    data: null,
  }
}
