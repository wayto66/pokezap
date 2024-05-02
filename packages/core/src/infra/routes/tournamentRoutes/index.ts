import { IResponse } from '../../../server/models/IResponse'
import { SubRouteNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { tournamentCreate } from './tournamentCreate'
import { tournamentDuel } from './tournamentDuel'
import { tournamentDuelAccept } from './tournamentDuelAccept'

import { tournamentEnter } from './tournamentEnter'
import { tournamentInfo } from './tournamentInfo'
import { tournamentStart } from './tournamentStart'

const subRouteMap = new Map<string, any>([
  // JOIN RAIND ROUTS

  ['CREATE', tournamentCreate],
  ['ENTRAR', tournamentEnter],
  ['ENTER', tournamentEnter],
  ['E', tournamentEnter],
  ['INFO', tournamentInfo],
  ['I', tournamentInfo],
  ['DUEL', tournamentDuel],
  ['DUEL-ACCEPT', tournamentDuelAccept],
  ['START', tournamentStart],
])

export const tournamentRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute)
    return {
      message: `Bem vindo à rota de TORNEIO!  [dsb]
     

      👍 - Ver informações do torneio atual
      ❤ - Entrar no torneio `,
      status: 200,
      actions: ['pz. torneio info', 'pz. torneio enter'],
    }

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
