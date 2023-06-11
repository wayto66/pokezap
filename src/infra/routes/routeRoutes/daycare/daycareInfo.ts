import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import {
  PlayerNotFoundError,
  RouteNotFoundError,
  RouteDoesNotHaveUpgradeError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { getHoursDifference } from '../../../../server/helpers/getHoursDifference'
import { iGenDaycareInfo } from '../../../../server/modules/imageGen/iGenDaycareInfo'

export const daycareInfo = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
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

  const route = await prismaClient.gameRoom.findFirst({
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
