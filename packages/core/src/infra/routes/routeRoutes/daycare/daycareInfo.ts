import { iGenDaycareInfo } from '../../../../../../image-generator/src/iGenDaycareInfo'
import prisma from '../../../../../../prisma-provider/src'
import { getHoursDifference } from '../../../../server/helpers/getHoursDifference'
import { IResponse } from '../../../../server/models/IResponse'
import {
  PlayerNotFoundError,
  RouteDoesNotHaveUpgradeError,
  RouteNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const daycareInfo = async (data: TRouteParams): Promise<IResponse> => {
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: true,
      teamPoke2: true,
      teamPoke3: true,
      teamPoke4: true,
      teamPoke5: true,
      teamPoke6: true,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const route = await prisma.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      upgrades: {
        include: {
          base: true,
        },
      },
      players: {
        include: {
          ownedPokemons: {
            include: {
              baseData: true,
              owner: true,
            },
          },
        },
      },
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!route.upgrades.map(upg => upg.base.name).includes('daycare')) throw new RouteDoesNotHaveUpgradeError('daycare')

  const playersPokemons = route.players.map(player => player.ownedPokemons).flat()
  const pokemonsInDaycare = playersPokemons.filter(pokemon => pokemon.isInDaycare === true)

  const displayMessage = pokemonsInDaycare.map(pokemon => {
    return `${pokemon.owner?.name} - #${pokemon.id} ${pokemon.baseData.name}  \n`
  })

  const remainingHoursMap = new Map<number, number>([])

  for (const poke of pokemonsInDaycare) {
    if (!poke.daycareEntry) throw new UnexpectedError('poke in daycare without daycarentry. id: ' + poke.id)
    remainingHoursMap.set(poke.id, 24 - getHoursDifference(poke.daycareEntry, new Date()))
  }

  const imageUrl = await iGenDaycareInfo({
    pokemons: pokemonsInDaycare,
    remainingHoursMap,
  })

  return {
    message: `Pokemons no daycare da rota ${route.id}
    ${displayMessage}`,
    imageUrl,
    status: 200,
  }
}
