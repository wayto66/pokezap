import { BaseRoomUpgrades, PrismaClient, RoomUpgrades } from '@prisma/client'
import { container } from 'tsyringe'
import { metaValues } from '../../../constants/metaValues'
import {
  EggIsNotReadyToBeHatch,
  PlayerNotFoundError,
  PlayersPokemonNotFoundError,
  TypeMissmatchError,
} from '../../../infra/errors/AppErrors'
import { getHoursDifference } from '../../../server/helpers/getHoursDifference'
import { IResponse } from '../../../server/models/IResponse'
import { PokemonBaseData } from '../../../server/modules/duel/duelNXN'
import { iGenPokemonAnalysis } from '../../../server/modules/imageGen/iGenPokemonAnalysis'
import { TRouteParams } from '../router'

export const pokemonHatch = async (data: TRouteParams): Promise<IResponse> => {
  const [, , pokemonIdString] = data.routeParams

  const pokemonId = pokemonIdString ? Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1)) : 0
  if (isNaN(pokemonId)) throw new TypeMissmatchError(pokemonIdString, 'número')

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
      gameRooms: {
        include: {
          upgrades: {
            include: {
              base: true,
            },
          },
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const isLabEnhanced = player.gameRooms.some(groom =>
    groom.upgrades.some((upg: RoomUpgrades & { base: BaseRoomUpgrades }) => upg.base.name === 'lab')
  )

  console.log({ isLabEnhanced })

  let pokemon: PokemonBaseData | undefined | null

  if (pokemonIdString) {
    pokemon = await prismaClient.pokemon.findFirst({
      where: {
        id: pokemonId,
        ownerId: player.id,
      },
      include: {
        baseData: true,
      },
    })
  } else {
    pokemon = player.ownedPokemons
      .filter(pokemon => !pokemon.isAdult)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]
  }
  if (!pokemon) throw new PlayersPokemonNotFoundError(pokemonId, player.name)

  if (getHoursDifference(pokemon.createdAt, new Date()) < metaValues.eggHatchingTimeInHours - (isLabEnhanced ? 12 : 0))
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
