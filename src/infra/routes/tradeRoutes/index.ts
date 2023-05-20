import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { tradePoke1 } from './tradePoke/tradePoke1'

const routesMap = new Map<string, any>([
  ['POKE', tradePoke1],
  ['POKEMON', tradePoke1],
  ['ITEN', undefined],
  ['ITEM', undefined],
  ['ITENS', undefined],
  ['ITEMS', undefined],
])

export const tradeRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [initializer, tradeRoute, subRouteName] = data.routeParams

  if (!subRouteName) {
    return {
      message: 'Esta é a rota de trade/trocas. Especifique se deseja trocar Pokemon ou item.',
      status: 300,
      data: null,
    }
  }

  const route = routesMap.get(subRouteName)

  if (!route) {
    return {
      message: `ERRO: Nenhuma rota encontrada com: "${subRouteName}". Verifique se digitou corretamente.`,
      status: 400,
      data: null,
    }
  }

  return await route(data)
}
