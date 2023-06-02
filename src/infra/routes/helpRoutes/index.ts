import { MissingParametersInventoryRouteError, SubRouteNotFoundError } from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'

const clanText = `PokeZap Wiki: *CLANS*
[Monte seu time com 6 pokemons de um clã para receber bonus!]

- VOLCANIC: fire + ground
- TOXIBUG: poison + bug
- GARDESTRIKE: normal + fighting
- MASTERMIND: dark + psychic + ghost
- SEAVELL: ice + water
- WINGEON: dragon + flying
- WONDERLEAF: grass + fairy
- THUNDERFORGE: steel + rock + electric
`
const pokeballsText = `
Pokezap Wiki: *POKEBALLS*
Alem das pokeballs normais, existem pokeballs elementais.
Elas possuem uma chance muito maior de catch quando usadas contra certos elementos:

- MAGU-BALL: fire ou ground
- TALE-BALL: dragon ou fairy
- TINKER-BALL: electric ou steel
- MOON-BALL: ghost ou dark
- YUME-BALL: normal ou psychic
- DUSK-BALL: lutador ou rock
- JANGURU-BALL: grass ou poison
- NET-BALL: water ou bug
- SORA-BALL: flying ou ice
`
const platesText = `
PokeZap Wiki: *PLATES*
Plates são um tipo de item que seu pokemon pode segurar.
(a função de segurar itens não está disponivel, mas ja pode ser obtido as plates.)

Draco Plate - fortalece o dano causado do tipo Dragon.
Flame Plate - fortalece o dano causado do tipo Fire.
Splash Plate - fortalece o dano causado do tipo Water.
Meadow Plate - fortalece o dano causado do tipo Grass.
Zap Plate - fortalece o dano causado do tipo Electric.
Icicle Plate - fortalece o dano causado do tipo Ice.
Fist Plate - fortalece o dano causado do tipo Fighting.
Toxic Plate - fortalece o dano causado do tipo Poison.
Earth Plate - fortalece o dano causado do tipo Ground.
Sky Plate - fortalece o dano causado do tipo Flying.
Mind Plate - fortalece o dano causado do tipo Psychic.
Stone Plate - fortalece o dano causado do tipo Rock.
Insect Plate - fortalece o dano causado do tipo Bug.
Spooky Plate - fortalece o dano causado do tipo Ghost.
Iron Plate - fortalece o dano causado do tipo Steel.
Dread Plate - fortalece o dano causado do tipo Dark.
Pixie Plate - fortalece o dano causado do tipo Fairy.`

const subRouteMap = new Map<string, any>([
  // INVENTORY ITEMS ROUTES
  ['CLAN', clanText],
  ['CLANS', clanText],
  ['POKEBALLS', pokeballsText],
  ['POKEBOLAS', pokeballsText],
  ['PLATES', platesText],
  ['PLACAS', platesText],
])

export const helpRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams
  if (!subRoute) throw new MissingParametersInventoryRouteError()

  const route = subRouteMap.get(subRoute)
  if (!route) throw new SubRouteNotFoundError(subRoute)

  return {
    message: route,
    status: 200,
    data: null,
  }
}
