import { MissingParametersBattleRouteError, TypeMissmatchError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { battleWildPokemon } from './battleWildPokemon'

export const battleRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , idString] = data.routeParams
  if (!idString) throw new MissingParametersBattleRouteError()

  const id = Number(idString)
  if (isNaN(id)) throw new TypeMissmatchError(idString, 'número')

  return await battleWildPokemon(data)
}
