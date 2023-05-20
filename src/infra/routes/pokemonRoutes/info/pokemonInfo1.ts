import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../../server/modules/imageGen/iGenPokemonAnalysis'

type TUserInfoParams = {
  playerPhone: string
  routeParams: string[]
  playerName: string
}

export const pokemonInfo1 = async (data: TUserInfoParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonId] = data.routeParams

  if (!pokemonId) {
    return {
      message: `ERROR: you must provide a pokemon id. `,
      status: 400,
      data: null,
    }
  }

  const pokemonIdFix = Number(pokemonId.slice(pokemonId.indexOf('#') + 1))

  if (typeof Number(pokemonIdFix) !== 'number') {
    return {
      message: `ERROR: ${pokemonIdFix} is not a number.`,
      status: 400,
      data: null,
    }
  }

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

  if (!pokemon) {
    return {
      message: 'ERRO: Pokemon não encontrado para o código: ' + pokemonIdFix,
      status: 400,
      data: null,
    }
  }

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
