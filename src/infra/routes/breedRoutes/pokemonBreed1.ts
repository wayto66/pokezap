import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { iGenPokemonBreed } from '../../../server/modules/imageGen/iGenPokemonBreed'
import { TRouteParams } from '../router'
import { pokemonBreed2 } from './pokemonBreed2'

export const pokemonBreed1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , id1, id2, amount] = data.routeParams

  if (amount) return await pokemonBreed2(data)
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (!id1 || !id2) {
    return {
      message: `ERROR: you must provide the ids for the pokemon pair to be breeded. The correct syntax would be something like:
      pokemon breed 123 456`,
      status: 400,
      data: null,
    }
  }
  const idFix1 = Number(id1.slice(id1.indexOf('#') + 1))
  const idFix2 = Number(id2.slice(id2.indexOf('#') + 1))

  if (typeof idFix1 !== 'number' || typeof idFix2 !== 'number') {
    return {
      message: `ERROR: something is wrong with the ids. Please verify if you are using the correct syntax.`,
      status: 400,
      data: null,
    }
  }

  const player1 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player1) {
    return {
      message: `UNEXPECTED_ERROR: no player found for phoneCode: ${data.playerPhone}`,
      status: 400,
      data: null,
    }
  }

  const pokemon1 = await prismaClient.pokemon.findFirst({
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

  if (!pokemon1) {
    return {
      message: `ERROR: no pokemon found for id: ${idFix1} and player: ${player1.name}`,
      status: 400,
      data: null,
    }
  }

  const pokemon2 = await prismaClient.pokemon.findFirst({
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

  if (!pokemon2) {
    return {
      message: `ERROR: no pokemon found for id: ${idFix2} and player: ${player1.name}`,
      status: 400,
      data: null,
    }
  }

  const imageUrl = await iGenPokemonBreed({
    pokemon1: pokemon1,
    pokemon2: pokemon2,
  })

  if (pokemon1.childrenId4)
    return {
      message: `#${pokemon1.id} ${pokemon1.baseData.name} já possui 3 filhotes.`,
      status: 300,
      data: null,
      imageUrl: imageUrl,
    }

  if (pokemon2.childrenId4)
    return {
      message: `#${pokemon2.id} ${pokemon2.baseData.name} já possui 3 filhotes.`,
      status: 300,
      data: null,
      imageUrl: imageUrl,
    }

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
