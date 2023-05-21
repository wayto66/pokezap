import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../../server/modules/imageGen/iGenPokemonAnalysis'
import { TRouteParams } from 'infra/routes/router'
import {
  MissingParametersPokemonInformationError,
  PokemonNotFoundError,
  TypeMissmatchError,
} from 'infra/errors/AppErrors'

export const pokemonInfo1 = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonId] = data.routeParams
  if (!pokemonId) throw new MissingParametersPokemonInformationError()

  const pokemonIdFix = Number(pokemonId.slice(pokemonId.indexOf('#') + 1))
  if (typeof Number(pokemonIdFix) !== 'number') throw new TypeMissmatchError(pokemonId, 'number')

  const pokemon = await prismaClient.pokemon.findUnique({
    where: { id: Number(pokemonIdFix) },
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
  if (!pokemon) throw new PokemonNotFoundError(pokemonIdFix)

  const imageUrl = await iGenPokemonAnalysis({
    pokemonData: pokemon,
  })

  if (pokemon.owner) {
    return {
      message: `#${pokemon.id} ${pokemon.baseData.name.toUpperCase()} de *${pokemon.owner.name}* ! `,
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
