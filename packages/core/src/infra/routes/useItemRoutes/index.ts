import { IResponse } from '../../../server/models/IResponse'
import { MissingParametersUseItemRouteError, NoSubRouteForUseItemRouteError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { usePokeballBox } from './items/usePokeballBox'
import { usePropCase } from './items/usePropCase'
import { useRareCandy } from './items/useRareCandy'
import { useTM } from './items/useTM'
import { useTMCase } from './items/useTMCase'

const itemMap = new Map<string, any>([
  ['TM', useTM],
  ['POKE-BALL-BOX', usePokeballBox],
  ['POKEBALL-BOX', usePokeballBox],
  ['TM-CASE', useTMCase],
  ['PROPCASE', usePropCase],
  ['PROP-CASE', usePropCase],
  ['RARE-CANDY', useRareCandy],
])

export const useItemRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , itemName] = data.routeParams
  if (!itemName) throw new MissingParametersUseItemRouteError()

  const route = itemMap.get(itemName)
  if (!route) throw new NoSubRouteForUseItemRouteError(itemName)

  return await route(data)
}
