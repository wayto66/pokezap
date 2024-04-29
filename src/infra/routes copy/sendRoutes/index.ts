import { MissingParametersSendRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { sendCash } from './sendCash'
import { sendItem } from './sendItem'
import { sendPoke } from './sendPoke'

const routesMap = new Map<string, any>([
  ['POKE', sendPoke],
  ['POKES', sendPoke],
  ['POKEMON', sendPoke],
  ['POKEMONS', sendPoke],
  ['POKÉMON', sendPoke],
  ['POKÉMONS', sendPoke],
  ['ITEN', sendItem],
  ['ITENS', sendItem],
  ['ITEM', sendItem],
  ['ITEMS', sendItem],
  ['CASH', sendCash],
  ['CASHES', sendCash],
  ['POKECOIN', sendCash],
  ['POKECOINS', sendCash],
  ['DINHEIRO', sendCash],
  ['MOEDA', sendCash],
  ['MOEDAS', sendCash],
])

export const sendRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRouteName] = data.routeParams
  if (!subRouteName) throw new MissingParametersSendRouteError()

  const route = routesMap.get(subRouteName)
  if (!route) throw new SubRouteNotFoundError(subRouteName)

  return await route(data)
}
