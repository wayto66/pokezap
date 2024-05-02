import { iGenPokemonAnalysis } from '../../../../../../image-generator/src/iGenPokemonAnalysis'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import { checkEvolutionPermition } from '../../../../server/modules/pokemon/checkEvolutionPermition'
import {
  getRegionalEvolutionData,
  handleAlolaGalarEvolution,
} from '../../../../server/modules/pokemon/handleAlolaGalarEvolution'
import {
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  RouteNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonEvolve = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, targetPokemonNameUppercase] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  const targetPokemonName = targetPokemonNameUppercase?.toLowerCase()

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
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

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
      owner: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemonId, player.name)

  const route = await prisma.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)

  const isRegional = getRegionalEvolutionData(pokemon.baseData)

  if (isRegional && route.region) {
    const evolutionData = await handleAlolaGalarEvolution({
      pokemon,
      currentRegion: route.region,
    })

    if (!evolutionData.evolved || !evolutionData.pokemon)
      return {
        message: evolutionData.errorMessage || 'Houve um erro na evolução.',
        status: 300,
      }

    const imageUrl = await iGenPokemonAnalysis(evolutionData.pokemon)
    return {
      message: `*${pokemon.baseData.name}* evoluiu para *${evolutionData.pokemon.baseData.name}*!`,
      imageUrl,
      status: 200,
      data: null,
    }
  }

  const evolvePoke = await checkEvolutionPermition({
    pokemonId: pokemon.id,
    playerId: player.id,
    preferredPokemonName: targetPokemonName,
  })

  if (evolvePoke && evolvePoke.status === 'evolved' && evolvePoke.message) {
    const evolvedPoke = await prisma.pokemon.findFirst({
      where: {
        id: pokemon.id,
      },
      include: {
        baseData: true,
      },
    })

    if (!evolvedPoke) throw new PokemonNotFoundError(pokemon.id)

    const imageUrl = await iGenPokemonAnalysis(evolvedPoke)
    return {
      message: evolvePoke.message,
      imageUrl,
      status: 200,
      data: null,
    }
  }

  if (
    isRegional &&
    !route.region &&
    evolvePoke.message === 'Não foi possível localizar a posição do pokemon na cadeia evolutiva.'
  )
    return {
      message: `Este pokemon parece evoluir apenas em uma certa região.`,
      status: 300,
    }

  if (evolvePoke && evolvePoke.message)
    return {
      message: evolvePoke.message,
      status: 300,
      data: null,
    }

  return {
    message: `Não foi possível evoluir o pokemon: #${pokemon.id} ${pokemon.baseData.name}.`,
    status: 200,
    data: null,
  }
}
