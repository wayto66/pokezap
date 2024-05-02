import prisma from '../../../../../../prisma-provider/src'
import { getHoursDifference } from '../../../../server/helpers/getHoursDifference'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import { handleLevelSet } from '../../../../server/modules/pokemon/handleLevelSet'
import {
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonInDaycareRemainingTime,
  PokemonNotFoundError,
  PokemonNotInDaycareError,
  RouteDoesNotHaveUpgradeError,
  RouteNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const daycareOut = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

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
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!route.upgrades.map(upg => upg.base.name).includes('daycare')) throw new RouteDoesNotHaveUpgradeError('daycare')

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    onlyAdult: true,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)
  if (!pokemon.isInDaycare) throw new PokemonNotInDaycareError(pokemon.id, pokemon.baseData.name)
  if (!pokemon.daycareEntry) throw new UnexpectedError('Pokemon está no daycare e não possui registro de entrada.')

  const hoursLeft = 24 - getHoursDifference(pokemon.daycareEntry, new Date())
  if (hoursLeft > 0) throw new PokemonInDaycareRemainingTime(pokemon.id, pokemon.baseData.name, hoursLeft.toFixed(2))

  const targetLevel = Math.ceil(route.level)

  await handleLevelSet({
    pokemon,
    targetLevel,
    removeFromDaycare: true,
  })

  return {
    message: `#${pokemon.id} ${pokemon.baseData.name} terminou seu dia no daycare e avançou para o nível ${targetLevel}`,
    status: 200,
  }
}
