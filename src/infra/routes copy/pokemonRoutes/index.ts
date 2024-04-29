import { MissingParametersPokemonRouteError, SubRouteNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { teamSet } from '../teamRoutes/teamSet'
import { pokemonDropItem } from './dropItem/pokemonDropItem'
import { pokemonEvolve } from './evolve/pokemonEvolve'
import { pokemonHoldItem } from './holdItem/pokemonHoldItem'
import { pokemonInfo1 } from './info/pokemonInfo1'
import { pokemonMegaEvolve } from './megaEvolve/pokemonMegaEvolve'
import { pokemonNickname } from './nickname/pokemonNickname'
import { pokemonSell } from './sell/pokemonSell'
import { pokemonSetRole } from './setRole/pokemonSetRole'
import { pokemonSkills } from './skills/pokemonSkills'
import { pokemonTeam } from './team/pokemonTeam'

const subRouteMap = new Map<string, any>([
  // POKEMON INFO ROUTES
  ['INFO', pokemonInfo1],
  ['INFORMATION', pokemonInfo1],
  ['INDO', pokemonInfo1],

  // POKEMON TEAM ROUTES
  [
    'TEAM',
    (data: TRouteParams) => {
      const newData = { ...data, routeParams: data.routeParams.slice(1) }
      teamSet(newData)
    },
  ],
  [
    'TIME',
    (data: TRouteParams) => {
      const newData = { ...data, routeParams: data.routeParams.slice(1) }
      teamSet(newData)
    },
  ],
  [
    'EQUIPE',
    (data: TRouteParams) => {
      const newData = { ...data, routeParams: data.routeParams.slice(1) }
      teamSet(newData)
    },
  ],

  // POEKMON SELL ROUTES
  ['SELL', pokemonSell],
  ['VENDER', pokemonSell],

  // POKEMON EVOLVE ROUTES
  ['EVOLVE', pokemonEvolve],
  ['EVOLUIR', pokemonEvolve],

  // POKEMON MEGA EVOLVE ROUTES
  ['MEGA-EVOLVE', pokemonMegaEvolve],
  ['MEGA-EVOLUIR', pokemonMegaEvolve],
  ['MEGAEVOLVE', pokemonMegaEvolve],
  ['MEGAEVOLUIR', pokemonMegaEvolve],

  // POKEMON SKILL ROUTES
  ['SKILL', pokemonSkills],
  ['SKILLS', pokemonSkills],
  ['MOVE', pokemonSkills],
  ['MOVES', pokemonSkills],
  ['GOLPE', pokemonSkills],
  ['GOLPES', pokemonSkills],
  ['PODER', pokemonSkills],
  ['PODERES', pokemonSkills],

  // POKEMON GIVE-ITEM ROUTES
  ['GIVE-ITEM', pokemonHoldItem],
  ['HOLD-ITEM', pokemonHoldItem],
  ['GIVEITEM', pokemonHoldItem],
  ['HOLDITEM', pokemonHoldItem],

  // POKEMON REMOVE-ITEM ROUTES
  ['TAKE-ITEM', pokemonDropItem],
  ['DROP-ITEM', pokemonDropItem],
  ['TAKEITEM', pokemonDropItem],
  ['DROPITEM', pokemonDropItem],

  // POKEMON NICKNAME ROUTES
  ['NICKNAME', pokemonNickname],
  ['APELIDO', pokemonNickname],

  // POKEMON SETROLE ROUTES
  ['SETROLE', pokemonSetRole],
  ['SET-ROLE', pokemonSetRole],
  ['SETFUNCTION', pokemonSetRole],
  ['SET-FUNCTION', pokemonSetRole],
])

export const pokemonRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersPokemonRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return await route(data)
}
