import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPokemonTeam } from '../../../../server/modules/imageGen/iGenPokemonTeam'
import { TRouteParams } from '../../router'

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

  if (!player)
    return {
      message: 'ERROR: NO PLAYER FOUND WITH ' + data.playerPhone,
      status: 400,
      data: null,
    }

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

  for (const id of ids) {
    if (typeof id !== 'number')
      return {
        message: 'ERROR: problem parsing id: ' + id,
        status: 400,
        data: null,
      }
  }

  for (const id of ids) {
    const poke = await prismaClient.pokemon.findFirst({
      where: {
        id: id,
      },
    })

    if (!poke)
      return {
        message: `ERRO: Não foi encontrado nenhum Pokemon com id ${id}.`,
        status: 400,
        data: null,
      }

    if (poke.ownerId !== player.id)
      return {
        message: `ERRO: Não foi encontrado nenhum Pokemon com id ${id}.`,
        status: 400,
        data: null,
      }
  }

  if (ids[0] !== 0) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        teamPokeId1: ids[0],
      },
    })
  }

  if (ids[1] !== 0) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        teamPokeId2: ids[1],
      },
    })
  }
  if (ids[2] !== 0) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        teamPokeId3: ids[2],
      },
    })
  }
  if (ids[3] !== 0) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        teamPokeId4: ids[3],
      },
    })
  }
  if (ids[4] !== 0) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        teamPokeId5: ids[4],
      },
    })
  }
  if (ids[5] !== 0) {
    await prismaClient.player.update({
      where: {
        id: player.id,
      },
      data: {
        teamPokeId6: ids[5],
      },
    })
  }

  return {
    message: 'DUMMY: poketeam updated',
    status: 200,
    data: null,
  }
}
