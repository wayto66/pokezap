import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  MissingParametersBuyAmountError,
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { IResponse } from '../../../../server/models/IResponse'
import { TRouteParams } from '../../router'
import { checkEvolutionPermition } from '../../../../server/modules/pokemon/checkEvolutionPermition'
import { iGenPokemonAnalysis } from '../../../../server/modules/imageGen/iGenPokemonAnalysis'

export const pokemonEvolve = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString] = data.routeParams
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

  const getPokemonRequestData = () => {
    if (searchMode === 'number')
      return {
        identifier: pokemonId,
        where: {
          id: pokemonId,
        },
      }
    if (searchMode === 'string')
      return {
        identifier: pokemonIdString.toLowerCase(),
        where: {
          baseData: {
            name: pokemonIdString.toLowerCase(),
          },
          ownerId: player.id,
        },
      }
  }

  const pokemonRequestData = getPokemonRequestData()
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prismaClient.pokemon.findFirst({
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

  const evolvePoke = await checkEvolutionPermition({
    pokemonId: pokemon.id,
    playerId: player.id,
  })

  if (evolvePoke && evolvePoke.status === 'evolved' && evolvePoke.message) {
    const evolvedPoke = await prismaClient.pokemon.findFirst({
      where: {
        id: pokemon.id,
      },
      include: {
        baseData: true,
      },
    })

    if (!evolvedPoke) throw new PokemonNotFoundError(pokemon.id)

    const imageUrl = await iGenPokemonAnalysis({
      pokemonData: evolvedPoke,
    })
    return {
      message: evolvePoke.message,
      imageUrl,
      status: 200,
      data: null,
    }
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
