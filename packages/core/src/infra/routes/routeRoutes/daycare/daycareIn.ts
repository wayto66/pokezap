import prisma from '../../../../../../prisma-provider/src'
import { getHoursDifference } from '../../../../server/helpers/getHoursDifference'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import {
  CantProceedWithPokemonInTeamError,
  DaycareIsFullError,
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonAboveDaycareLevelLimit,
  PokemonHasNotBornYetError,
  PokemonInDaycareRemainingTime,
  PokemonNotFoundError,
  RouteDoesNotHaveUpgradeError,
  RouteNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const daycareIn = async (data: TRouteParams): Promise<IResponse> => {
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
      players: {
        include: {
          ownedPokemons: true,
        },
      },
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!route.upgrades.map(upg => upg.base.name).includes('daycare')) throw new RouteDoesNotHaveUpgradeError('daycare')
  if (route.players.map(player => player.ownedPokemons.filter(poke => poke.isInDaycare === true)).flat().length >= 9)
    throw new DaycareIsFullError()

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
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
  if (!pokemon.isAdult) throw new PokemonHasNotBornYetError(pokemon.id)
  if (pokemon.isInDaycare) {
    if (!pokemon.daycareEntry) throw new UnexpectedError('Pokemon está no daycare e não possui registro de entrada.')
    const hoursLeft = getHoursDifference(pokemon.daycareEntry, new Date())
    throw new PokemonInDaycareRemainingTime(pokemon.id, pokemon.baseData.name, hoursLeft.toFixed(2))
  }
  if (pokemon.level >= route.level)
    throw new PokemonAboveDaycareLevelLimit(pokemon.id, pokemon.baseData.name, route.level)
  if (
    [
      player.teamPoke1?.id,
      player.teamPoke2?.id,
      player.teamPoke3?.id,
      player.teamPoke4?.id,
      player.teamPoke5?.id,
      player.teamPoke6?.id,
    ].includes(pokemon.id)
  )
    throw new CantProceedWithPokemonInTeamError(pokemon.id, pokemon.baseData.name)

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      isInDaycare: true,
      daycareEntry: new Date(),
    },
  })

  return {
    message: `*${player.name}* colocou #${pokemon.id} ${pokemon.baseData.name} no daycare.`,
    status: 200,
  }
}
