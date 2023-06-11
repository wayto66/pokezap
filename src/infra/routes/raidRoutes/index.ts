import { IResponse } from '../../../server/models/IResponse'
import { MissingParameterError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { raidCancel } from './raidCancel'
import { raidCreate } from './raidCreate'
import { raidJoin } from './raidJoin'
import { raidRoomSelect } from './raidRoomSelect'
import { raidTeam } from './raidTeam'

const subRouteMap = new Map<string, any>([
  // START RAID ROUTES
  ['START', raidCreate],
  ['INICIAR', raidCreate],
  ['CREATE', raidCreate],

  // JOIN RAIND ROUTS
  ['JOIN', raidJoin],
  ['ENTER', raidJoin],
  ['ENTRAR', raidJoin],

  // ROOM SELECT
  ['SELECT', raidRoomSelect],
  ['SELECT-ONLYCREATOR', raidRoomSelect],

  ['CANCEL', raidCancel],
  ['CANCELAR', raidCancel],

  ['TEAM', raidTeam],
  ['TIME', raidTeam],
])

export const raidRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParameterError('Ação')

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
