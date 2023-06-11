import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../../server/modules/imageGen/iGenPokemonAnalysis'
import { checkEvolutionPermition } from '../../../../server/modules/pokemon/checkEvolutionPermition'
import {
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonDoesNotHasMegaEvolutionError,
  PokemonNotFoundError,
  RequiredItemNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'

export const pokemonMegaEvolve = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString, targetPokemonName] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: true,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    onlyAdult: true,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prismaClient.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
      owner: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemonId, player.name)

  if (!pokemon.baseData.hasMegaEvolution)
    throw new PokemonDoesNotHasMegaEvolutionError(pokemon.id, pokemon.baseData.name)
  if (pokemon.baseData.hasMegaEvolution) throw new RequiredItemNotFoundError()

  return {
    message: `Não foi possível evoluir o pokemon: #${pokemon.id} ${pokemon.baseData.name}.`,
    status: 200,
    data: null,
  }
}
