import { IResponse } from '../../server/models/IResponse'
import { catchRoutes } from './catchRoutes'
import { duelRoutes } from './duelRoutes'
import { inventoryRoutes } from './inventoryRoutes'
import { pokemonRoutes } from './pokemonRoutes'
import { routeRoutes } from './routeRoutes'
import { tradeRoutes } from './tradeRoutes'
import { playerInfo1 } from './userRoutes/info/playerInfo1'
import { newUser1 } from './userRoutes/newUser/newUser1'

export type TRouteParams = {
  playerPhone: string
  groupCode: string
  routeParams: string[]
  playerName: string
  fromReact?: boolean
}

const routeMap = new Map<string, any>([
  ['INICIAR', newUser1],
  ['INICIO', newUser1],
  ['START', newUser1],
  ['INÍCIO', newUser1],
  ['JOGADOR', playerInfo1],
  ['PLAYER', playerInfo1],
  ['POKEMON', pokemonRoutes],
  ['POKÉMON', pokemonRoutes],
  ['POKE', pokemonRoutes],
  ['POKEMÓN', pokemonRoutes],
  ['ROUTE', routeRoutes],
  ['ROTA', routeRoutes],
  ['ROTAS', routeRoutes],
  ['ROUTES', routeRoutes],
  ['CATCH', catchRoutes],
  ['CAPTURAR', catchRoutes],
  ['CAPTURA', catchRoutes],
  ['INVENTARIO', inventoryRoutes],
  ['INVENTORY', inventoryRoutes],
  ['DUEL', duelRoutes],
  ['DUELAR', duelRoutes],
  ['DUELO', duelRoutes],
  ['TRADE', tradeRoutes],
  ['TROCA', tradeRoutes],
  ['TROCAR', tradeRoutes],
])

export const router = async (data: TRouteParams): Promise<IResponse> => {
  const [, routeName] = data.routeParams

  if (!routeName) {
    return {
      status: 300,
      data: null,
      message: `Please specify a route.`,
    }
  }

  const route = routeMap.get(routeName.toUpperCase().trim())
  if (!route)
    return {
      status: 400,
      data: null,
      message: `No route found for ${data.playerName} with ${data.routeParams[1]}`,
    }

  return await route(data)
}
