import { BaseItem, Item, Player, PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  AppError,
  PlayerInRaidIsLockedError,
  PlayerNotFoundError,
  RouteNotFoundError,
  RouteNotProvidedError,
} from '../../infra/errors/AppErrors'
import { IResponse } from '../../server/models/IResponse'
import { PokemonBaseData } from '../../server/modules/duel/duelNXN'
import { logger } from '../logger'
import { battleRoutes } from './battleRoutes'
import { pokemonBreed1 } from './breedRoutes/pokemonBreed1'
import { pokemonHatch } from './breedRoutes/pokemonHatch'
import { catchRoutes } from './catchRoutes'
import { duelRoutes } from './duelRoutes'
import { helpRoutes } from './helpRoutes'
import { invasionRoutes } from './invasionRoutes'
import { inventoryRoutes } from './inventoryRoutes'
import { pokemonRoutes } from './pokemonRoutes'
import { raidRoutes } from './raidRoutes'
import { rankRoutes } from './rankingRoutes'
import { routeRoutes } from './routeRoutes'
import { sellRoutes } from './sellRoutes'
import { sendRoutes } from './sendRoutes'
import { shopRoutes } from './shopRoutes'
import { tradeRoutes } from './tradeRoutes'
import { playerInfo1 } from './userRoutes/info/playerInfo1'
import { newUser1 } from './userRoutes/newUser/newUser1'
import { teamRoutes } from './teamRoutes'
import { casinoRoutes } from './casinoRoutes'
import { megaRoutes } from './megaRoutes'
import { admRoutes } from './admRoutes'
import { marketRoutes } from './marketRoutes'

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
  ['COMBINAR', pokemonBreed1],
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
])

export const router = async (data: TRouteParams): Promise<IResponse> => {
  try {
    const [, routeName] = data.routeParams
    if (!routeName) throw new RouteNotProvidedError()

    const route = routeMap.get(routeName.toUpperCase().trim())
    if (!route) throw new RouteNotFoundError(data.playerName, routeName)

    /*  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
    const player = await prismaClient.player.findFirst({
      where: {
        phone: data.playerPhone,
      },
    })

    if (!player) throw new PlayerNotFoundError(data.playerPhone)
    if (player.isInRaid && routeName !== 'RAID') throw new PlayerInRaidIsLockedError(player.name) */

    return await route(data)
  } catch (error) {
    if (!(error instanceof AppError)) {
      logger.error(error)
      return {
        message: `Houve um erro inesperado na solicitação de ${data.playerName}`,
        status: 400,
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
