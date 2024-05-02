import prisma from '../../../../prisma-provider/src'
import { PrismaClient } from '../../../../prisma-provider/src/types'
import { AppError, RouteNotFoundError, RouteNotProvidedError } from '../../infra/errors/AppErrors'
import { IResponse } from '../../server/models/IResponse'
import { PokemonBaseData } from '../../types'
import { BaseItem, Item, Player } from '../../types/prisma'
import { logger } from '../logger'
import { admRoutes } from './admRoutes'
import { battleRoutes } from './battleRoutes'
import { pokemonBreed1 } from './breedRoutes/pokemonBreed1'
import { pokemonHatch } from './breedRoutes/pokemonHatch'
import { casinoRoutes } from './casinoRoutes'
import { catchRoutes } from './catchRoutes'
import { duelRoutes } from './duelRoutes'
import { helpRoutes } from './helpRoutes'
import { invasionRoutes } from './invasionRoutes'
import { inventoryRoutes } from './inventoryRoutes'
import { marketRoutes } from './marketRoutes'
import { megaRoutes } from './megaRoutes'
import { pokemonRoutes } from './pokemonRoutes'
import { pokemonEvolve } from './pokemonRoutes/evolve/pokemonEvolve'
import { pokemonSetRole } from './pokemonRoutes/setRole/pokemonSetRole'
import { raidRoutes } from './raidRoutes'
import { rankRoutes } from './rankingRoutes'
import { routeRoutes } from './routeRoutes'
import { daycareRoutes } from './routeRoutes/daycare'
import { pokeranchRoute } from './routeRoutes/pokeranch/pokeranchRoute'
import { sellRoutes } from './sellRoutes'
import { sendRoutes } from './sendRoutes'
import { shopRoutes } from './shopRoutes'
import { teamRoutes } from './teamRoutes'
import { tournamentRoutes } from './tournamentRoutes'
import { tradeRoutes } from './tradeRoutes'
import { useItemRoutes } from './useItemRoutes'
import { playerRoutes } from './userRoutes'
import { register } from './userRoutes/newUser'
import { playerCash } from './userRoutes/playerCash'
import { playerEnergy } from './userRoutes/playerEnergy'

export type TRouteParams = {
  playerPhone: string
  groupCode: string
  routeParams: string[]
  playerName: string
  fromReact?: boolean
  player?: Player & {
    ownedPokemons: PokemonBaseData
    ownedItems: Item & {
      baseItem: BaseItem
    }
  }
  prismaClient: PrismaClient
}
export type TRouteType = (data: TRouteParams) => Promise<IResponse>

const routeMap = new Map<string, TRouteType>([
  // NEW USER ROUTES
  ['INICIAR', register],
  ['INICIO', register],
  ['START', register],
  ['INÍCIO', register],

  // PLAYER INFO ROUTES
  ['JOGADOR', playerRoutes],
  ['PLAYER', playerRoutes],

  // POKEMON ROUTES
  ['POKE', pokemonRoutes],
  ['POKÉMON', pokemonRoutes],
  ['POKEMON', pokemonRoutes],

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
  ['BAG', inventoryRoutes],

  // DUEL ROUTES
  ['DUEL', duelRoutes],
  ['DUELAR', duelRoutes],
  ['DUELO', duelRoutes],

  // TRADE ROUTES
  ['TRADE', tradeRoutes],
  ['TROCA', tradeRoutes],
  ['TROCAR', tradeRoutes],

  // TOURNAMENT ROUTES
  ['TORNEIO', tournamentRoutes],
  ['TOURNAMENT', tournamentRoutes],

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
  ['COMBINAR', pokemonBreed1],
  ['HATCH', pokemonHatch],
  ['CHOCAR', pokemonHatch],

  // HELP ROUTES
  ['HELP', helpRoutes],
  ['WIKI', helpRoutes],
  ['AJUDA', helpRoutes],
  ['INFO', helpRoutes],

  // SEND ROUTES
  ['SEND', sendRoutes],
  ['ENVIAR', sendRoutes],

  // INVASION ROUTES
  ['INVASION', invasionRoutes],

  // RAID ROUTES
  ['RAID', raidRoutes],

  // SELL ROUTES
  ['SELL', sellRoutes],
  ['VENDER', sellRoutes],

  // TEAM ROUTES
  ['TEAM', teamRoutes],
  ['TIME', teamRoutes],
  ['POKETEAM', teamRoutes],
  ['POKE-TIME', teamRoutes],

  // BAZAR ROUTES
  ['CASINO', casinoRoutes],
  ['CASSINO', casinoRoutes],

  // MEGA ROUTES
  ['MEGA', megaRoutes],

  // ADM ROUTES
  ['ADM', admRoutes],

  // MARKET ROUTES
  ['MARKET', marketRoutes],
  ['MERCADO', marketRoutes],

  // USEITEM ROUTES
  ['USEITEM', useItemRoutes],
  ['USE-ITEM', useItemRoutes],
  ['USEITEN', useItemRoutes],
  ['USE-ITEN', useItemRoutes],
  ['USE', useItemRoutes],

  /// //////////// EXPRESS ROUTES ////////////////////

  ['P', pokemonRoutes],
  ['I', inventoryRoutes],
  ['T', tradeRoutes],
  ['L', shopRoutes],
  ['B', shopRoutes],
  ['CASH', (data: TRouteParams) => playerCash({ ...data, routeParams: ['pz', 'player', 'cash'] })],
  ['MONEY', playerCash],
  ['ENERGY', playerEnergy],
  ['ENERGIA', playerEnergy],
  [
    'EVOLVE',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return pokemonEvolve({ ...data, routeParams })
    },
  ],
  [
    'DAYCARE',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return daycareRoutes({ ...data, routeParams })
    },
  ],
  [
    'DAY-CARE',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return daycareRoutes({ ...data, routeParams })
    },
  ],
  [
    'POKERANCH',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return pokeranchRoute({ ...data, routeParams })
    },
  ],
  [
    'POKE-RANCH',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return pokeranchRoute({ ...data, routeParams })
    },
  ],
  [
    'SETROLE',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return pokemonSetRole({ ...data, routeParams })
    },
  ],
  [
    'SET-ROLE',
    (data: TRouteParams) => {
      const routeParams = [...data.routeParams]
      routeParams.unshift('shift')
      return pokemonSetRole({ ...data, routeParams })
    },
  ],
])

export const router = async (data: TRouteParams): Promise<IResponse> => {
  try {
    const [, routeName] = data.routeParams
    if (!routeName) throw new RouteNotProvidedError()

    const route = routeMap.get(routeName.toUpperCase().trim())
    if (!route) throw new RouteNotFoundError(data.playerName, routeName)

    return await route({ ...data, prismaClient: prisma })
  } catch (error) {
    logger.error(error)
    if (!(error instanceof AppError)) {
      return {
        message: `Houve um erro inesperado na solicitação de ${data.playerName}`,
        status: 300,
      }
    }

    return {
      data: error.data,
      message: error.message,
      status: error.statusCode,
      actions: error.actions,
    }
  }
}
