import { iGenPokemonBreed } from '../../../../../image-generator/src'
import prisma from '../../../../../prisma-provider/src'
import {
  CantBreedShiniesError,
  MissingParametersBreedRouteError,
  PlayerNotFoundError,
  PlayersPokemonNotFoundError,
  PokemonAlreadyHasChildrenError,
  TypeMissmatchError,
} from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { pokemonBreed2 } from './pokemonBreed2'

export const pokemonBreed1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , id1, id2, amount] = data.routeParams
  if (!id1 || !id2) throw new MissingParametersBreedRouteError()
  if (amount) return await pokemonBreed2(data)

  const idFix1 = Number(id1.slice(id1.indexOf('#') + 1))
  if (typeof idFix1 !== 'number') throw new TypeMissmatchError(id1, 'number')

  const idFix2 = Number(id2.slice(id2.indexOf('#') + 1))
  if (typeof idFix2 !== 'number') throw new TypeMissmatchError(id2, 'number')

  const player1 = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player1) throw new PlayerNotFoundError(data.playerPhone)

  const pokemon1 = await prisma.pokemon.findFirst({
    where: {
      id: idFix1,
      ownerId: player1.id,
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
  if (!pokemon1) throw new PlayersPokemonNotFoundError(idFix1, player1.name)

  const pokemon2 = await prisma.pokemon.findFirst({
    where: {
      id: idFix2,
      ownerId: player1.id,
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
  if (!pokemon2) throw new PlayersPokemonNotFoundError(idFix2, player1.name)

  const imageUrl = await iGenPokemonBreed({
    pokemon1: pokemon1,
    pokemon2: pokemon2,
  })

  if (pokemon1.childrenId4) throw new PokemonAlreadyHasChildrenError(pokemon1.id, pokemon1.baseData.name, 4)
  if (pokemon2.childrenId4) throw new PokemonAlreadyHasChildrenError(pokemon2.id, pokemon1.baseData.name, 4)

  if (pokemon1.isShiny || pokemon2.isShiny) throw new CantBreedShiniesError()

  return {
    message: `*${player1.name}* inicou o processo de breed entre:
    #${pokemon1.id} ${pokemon1.baseData.name} e #${pokemon2.id} ${pokemon2.baseData.name}
    
    👍 - 1 filhote
    ❤ - 2 filhotes
    😂 - 3 filhotes
    😮 - 4 filhotes`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [
      `pz. breed ${pokemon1.id} ${pokemon2.id} 1`,
      `pz. breed ${pokemon1.id} ${pokemon2.id} 2`,
      `pz. breed ${pokemon1.id} ${pokemon2.id} 3`,
      `pz. breed ${pokemon1.id} ${pokemon2.id} 4`,
    ],
  }
}
