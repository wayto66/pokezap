import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { metaValues } from '../../../constants/metaValues'
import {
  EggIsNotReadyToBeHatch,
  MissingParametersBreedRouteError,
  PlayerNotFoundError,
  PlayersPokemonNotFoundError,
  TypeMissmatchError,
} from '../../../infra/errors/AppErrors'
import { getHoursDifference } from '../../../server/helpers/getHoursDifference'
import { IResponse } from '../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../server/modules/imageGen/iGenPokemonAnalysis'
import { TRouteParams } from '../router'

export const pokemonHatch = async (data: TRouteParams): Promise<IResponse> => {
  const [, , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersBreedRouteError()

  if (pokemonIdString === 'CHECK') return await pokemonHatchCheck(data)

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (isNaN(pokemonId)) throw new TypeMissmatchError(pokemonIdString, 'número')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: pokemonId,
      ownerId: player.id,
    },
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
    },
  })
  if (!pokemon) throw new PlayersPokemonNotFoundError(pokemonId, player.name)

  if (getHoursDifference(pokemon.createdAt, new Date()) < metaValues.eggHatchingTimeInHours)
    throw new EggIsNotReadyToBeHatch(
      pokemon.id,
      metaValues.eggHatchingTimeInHours - getHoursDifference(pokemon.createdAt, new Date())
    )

  const bornPokemon = await prismaClient.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      isAdult: true,
      spriteUrl: pokemon.baseData.defaultSpriteUrl,
    },
    include: { baseData: true },
  })

  const imageUrl = await iGenPokemonAnalysis(bornPokemon)

  return {
    message: `#${pokemon.id} ${pokemon.baseData.name} nasceu! `,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}

export const pokemonHatchCheck = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: {
        include: {
          baseData: true,
        },
      },
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  return {
    message: `Ovos prontos para serem chocados: \n \n ${player?.ownedPokemons
      .map(p => {
        if (getHoursDifference(p.createdAt, new Date()) > 24) return p.id
      })
      .join(', ')}`,
    status: 200,
  }
}
