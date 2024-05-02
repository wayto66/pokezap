import prisma from '../../../../../prisma-provider/src'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const teamMainPoke = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams

  let searchMode = 'string'

  if (!pokemonIdString) throw new MissingParameterError('Nome/id do pokemon')

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
  })
  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)

  const currentTeamIds = [
    ...new Set([
      player.teamPokeId1,
      player.teamPokeId2,
      player.teamPokeId3,
      player.teamPokeId4,
      player.teamPokeId5,
      player.teamPokeId6,
    ]),
  ].filter(value => value !== pokemon.id)

  await prisma.player.update({
    where: { id: player.id },
    data: {
      teamPokeId1: pokemon.id,
      teamPokeId2: currentTeamIds[0],
      teamPokeId3: currentTeamIds[1],
      teamPokeId4: currentTeamIds[2],
      teamPokeId5: currentTeamIds[3],
      teamPokeId6: currentTeamIds[4],
    },
  })

  return {
    message: '',
    react: '👌',
    status: 200,
  }
}
