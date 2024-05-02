import { iGenPokemonAnalysis } from '../../../../../../image-generator/src/iGenPokemonAnalysis'
import prisma from '../../../../../../prisma-provider/src'
import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'

export const pokemonInfo1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const basePokemonNamesPre = await prisma.basePokemon.findMany({
    select: {
      name: true,
    },
  })

  const basePokemonNames = basePokemonNamesPre.map(p => p.name)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    includeNotOwned: !basePokemonNames.includes(pokemonIdString.toLowerCase()),
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
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)

  const [parent1, parent2] = await prisma.pokemon.findMany({
    where: {
      id: {
        in: [pokemon?.parentId1 ?? 0, pokemon?.parentId2 ?? 0],
      },
    },
  })

  const imageUrl = await iGenPokemonAnalysis({ pokemon, parent1, parent2 })

  if (!pokemon.isAdult && pokemon.owner)
    return {
      message: `#${pokemon.id} de *${pokemon.owner.name}* ! `,
      status: 200,
      data: null,
      imageUrl: imageUrl,
    }

  if (pokemon.owner) {
    return {
      message: `#${pokemon.id} ${pokemon.nickName ?? pokemon.baseData.name.toUpperCase()} de *${
        pokemon.owner.name
      }* ! `,
      status: 200,
      data: null,
      imageUrl: imageUrl,
    }
  }

  return {
    message: `#${pokemon.id} ${pokemon.baseData.name.toUpperCase()} selvagem! `,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
