import { AppError, RouteNotFoundError, RouteNotProvidedError, UnexpectedError } from '../../infra/errors/AppErrors'
import { IResponse } from '../../server/models/IResponse'
import { battleRoutes } from './battleRoutes'
import { pokemonBreed1 } from './breedRoutes/pokemonBreed1'
import { pokemonHatch } from './breedRoutes/pokemonHatch'
import { catchRoutes } from './catchRoutes'
import { duelRoutes } from './duelRoutes'
import { helpRoutes } from './helpRoutes'
import { invasionRoutes } from './invasionRoutes'
import { inventoryRoutes } from './inventoryRoutes'
import { pokemonRoutes } from './pokemonRoutes'
import { rankRoutes } from './rankingRoutes'
import { routeRoutes } from './routeRoutes'
import { sendRoutes } from './sendRoutes'
import { shopRoutes } from './shopRoutes'
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
type TRouteType = (data: TRouteParams) => Promise<IResponse>

const routeMap = new Map<string, TRouteType>([
  // NEW USER ROUTES
  ['INICIAR', newUser1],
  ['INICIO', newUser1],
  ['START', newUser1],
  ['INÍCIO', newUser1],

  // PLAYER INFO ROUTES
  ['JOGADOR', playerInfo1],
  ['PLAYER', playerInfo1],

  // POKEMON ROUTES
  ['POKEMON', pokemonRoutes],
  ['POKE', pokemonRoutes],
  ['POKEMÓN', pokemonRoutes],

  // ROUTE ROUTES
  ['ROUTE', routeRoutes],
  ['ROTA', routeRoutes],
  ['ROTAS', routeRoutes],
  ['ROUTES', routeRoutes],

  // CATCH ROUTES
  ['CATCH', catchRoutes],
  ['CAPTURAR', catchRoutes],
  ['CAPTURA', catchRoutes],

  // INVENTORY ROUTES
  ['INVENTARIO', inventoryRoutes],
  ['INVENTORY', inventoryRoutes],

  // DUEL ROUTES
  ['DUEL', duelRoutes],
  ['DUELAR', duelRoutes],
  ['DUELO', duelRoutes],

  // TRADE ROUTES
  ['TRADE', tradeRoutes],
  ['TROCA', tradeRoutes],
  ['TROCAR', tradeRoutes],

  // SHOP ROUTES
  ['SHOP', shopRoutes],
  ['STORE', shopRoutes],
  ['LOJA', shopRoutes],
  ['MART', shopRoutes],
  ['POKEMART', shopRoutes],
  ['COMPRAR', shopRoutes],
  ['BUY', shopRoutes],

  // BATTLE ROUTES
  ['BATTLE', battleRoutes],

  // RANK ROUTES
  ['RANK', rankRoutes],
  ['RANKING', rankRoutes],

  // BREED ROUTES
  ['BREED', pokemonBreed1],
  ['HATCH', pokemonHatch],
  ['CHOCAR', pokemonHatch],

  // HELP ROUTES
  ['HELP', helpRoutes],
  ['WIKI', helpRoutes],
  ['AJUDA', helpRoutes],

  // SEND ROUTES
  ['SEND', sendRoutes],
  ['ENVIAR', sendRoutes],

  // INVASION ROUTES
  ['INVASION', invasionRoutes],
])

export const router = async (data: TRouteParams): Promise<IResponse> => {
  try {
    const [, routeName] = data.routeParams
    if (!routeName) throw new RouteNotProvidedError()

    const route = routeMap.get(routeName.toUpperCase().trim())
    if (!route) throw new RouteNotFoundError(data.playerName, routeName)

    return await route(data)
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.log(error)
      throw new UnexpectedError('')
    }

    return {
      data: error.data,
      message: error.message,
      status: error.statusCode,
    }
  }
}
