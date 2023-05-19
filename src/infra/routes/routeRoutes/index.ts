import { IResponse } from "server/models/IResponse"
import { TRouteParams } from "../router"
import { routeEnter } from "./enter/routeEnter"
import { routeInfo } from "./info/routeInfo"
import { routeStart } from "./start/routeStart"

const routesMap = new Map<string, any>([
  ["ENTRAR", routeEnter],
  ["ENTER", routeEnter],
  ["SAIR", undefined],
  ["LEAVE", undefined],
  ["QUIT", undefined],
  ["EXIT", undefined],
  ["UPGRADE", undefined],
  ["INFO", routeInfo],
  ["START", routeStart],
  ["INICIO", routeStart],
  ["INICIAR", routeStart],
])

export const routeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [command, routeName, subRouteName] = data.routeParams

  if (!subRouteName) {
    return {
      message:
        "DUMMY: This is the routes route. Please specify a sub-route name",
      status: 300,
      data: null,
    }
  }

  const route = routesMap.get(subRouteName)

  if (!route) {
    return {
      message: `ERROR: No route found for: "${subRouteName}". Please verify if the route name is correct.`,
      status: 400,
      data: null,
    }
  }

  return await route(data)
}
