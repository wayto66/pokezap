import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokemonTeam } from '../../../../server/modules/imageGen/iGenPokemonTeam'
import { TRouteParams } from '../../router'
import { PlayerNotFoundError, PokemonNotFoundError, TypeMissmatchError } from 'infra/errors/AppErrors'

export const pokemonTeam = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , id1, id2, id3, id4, id5, id6] = data.routeParams

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
      ownedHeldItems: true,
      teamPoke1: {
        include: {
          baseData: true,
        },
      },
      teamPoke2: {
        include: {
          baseData: true,
        },
      },
      teamPoke3: {
        include: {
          baseData: true,
        },
      },
      teamPoke4: {
        include: {
          baseData: true,
        },
      },
      teamPoke5: {
        include: {
          baseData: true,
        },
      },
      teamPoke6: {
        include: {
          baseData: true,
        },
      },
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerName)

  if (!id1) {
    const imageUrl = await iGenPokemonTeam({
      playerData: player,
    })

    return {
      message: `Time Pokemon de ${player.name}`,
      status: 200,
      data: null,
      imageUrl: imageUrl,
    }
  }

  const ids = [Number(id1), Number(id2 || 0), Number(id3 || 0), Number(id4 || 0), Number(id5 || 0), Number(id6 || 0)]
  const uniqueIds = [...new Set(ids)]

  for (const id of uniqueIds) {
    if (typeof id !== 'number' || isNaN(id)) throw new TypeMissmatchError(String(id), 'number')
    if (id === 0) continue
    const pokemon = await prismaClient.pokemon.findFirst({
      where: {
        id: id,
      },
    })
    if (!pokemon || pokemon.ownerId !== player.id) throw new PokemonNotFoundError(id)
  }

  for (let i = 0; i < 6; i++) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        ['teamPoke' + (i + 1)]: {
          disconnect: true,
        },
      },
    })
  }

  for (let i = 0; i < 6; i++) {
    if (uniqueIds[i] !== 0) {
      await prismaClient.player.update({
        where: {
          id: player.id,
        },
        data: {
          ['teamPokeId' + (i + 1)]: uniqueIds[i],
        },
      })
    }
  }

  const updatedPlayer = await prismaClient.player.findUnique({
    where: {
      id: player.id,
    },
    include: {
      teamPoke1: {
        include: {
          baseData: true,
        },
      },
      teamPoke2: {
        include: {
          baseData: true,
        },
      },
      teamPoke3: {
        include: {
          baseData: true,
        },
      },
      teamPoke4: {
        include: {
          baseData: true,
        },
      },
      teamPoke5: {
        include: {
          baseData: true,
        },
      },
      teamPoke6: {
        include: {
          baseData: true,
        },
      },
    },
  })

  const imageUrl = await iGenPokemonTeam({
    playerData: updatedPlayer,
  })

  return {
    message: `Time de *#${player.id}-${player.name}* foi atualizado!`,
    status: 200,
    data: null,
    imageUrl,
  }
}
