import { iGenPokemonTeam } from '../../../../../../image-generator/src/iGenPokemonTeam'
import {
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonHasNotBornYetError,
  PokemonNotFoundError,
  TypeMissmatchError,
} from '../../../../infra/errors/AppErrors'
import { getActiveClanBonus } from '../../../../server/helpers/getActiveClanBonus'
import { IResponse } from '../../../../server/models/IResponse'
import { TRouteParams } from '../../router'

export const pokemonTeam = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , id1, id2, id3, id4, id5, id6] = data.routeParams

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: {
        include: {
          baseData: true,
        },
      },
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
      message: `Time Pokemon de ${player.name} 
      Bonus de clã ativo: ${getActiveClanBonus([
        player.teamPoke1,
        player.teamPoke2,
        player.teamPoke3,
        player.teamPoke4,
        player.teamPoke5,
        player.teamPoke6,
      ])}`,
      status: 200,
      data: null,
      imageUrl: imageUrl,
    }
  }

  const stringNames = [id1, id2, id3, id4, id5, id6]
  const ids = [Number(id1), Number(id2 || 0), Number(id3 || 0), Number(id4 || 0), Number(id5 || 0), Number(id6 || 0)]
  const uniqueIds = [...new Set(ids)]

  let searchType = 'string'
  if (!isNaN(ids[0])) searchType = 'number'

  if (searchType === 'string') {
    const pokemonsIds: number[] = []

    for (const name of stringNames) {
      if (!name) continue
      const lowercaseName = name.toLowerCase()
      const pokemon = await prisma.pokemon.findFirst({
        where: {
          OR: [
            {
              baseData: {
                name: lowercaseName,
              },
            },
            { nickName: lowercaseName },
          ],
          ownerId: player.id,
        },
      })
      if (!pokemon) throw new PokemonNotFoundError(lowercaseName)
      if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(lowercaseName, player.name)
      if (!pokemon.isAdult) throw new PokemonHasNotBornYetError(pokemon.id)
      if (!pokemonsIds.includes(pokemon.id)) pokemonsIds.push(pokemon.id)
    }

    for (let i = 0; i < 6; i++) {
      await prisma.player.update({
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
      if (pokemonsIds[i] !== 0) {
        await prisma.player.update({
          where: {
            id: player.id,
          },
          data: {
            ['teamPokeId' + (i + 1)]: pokemonsIds[i],
          },
        })
      }
    }

    return {
      message: ``,
      status: 200,
      data: null,
      react: `👍`,
    }
  }

  for (const id of uniqueIds) {
    if (isNaN(id)) throw new TypeMissmatchError(id.toString(), 'numero')
    if (id === 0) continue
    const pokemon = await prisma.pokemon.findFirst({
      where: {
        id: id,
      },
    })
    if (!pokemon) throw new PokemonNotFoundError(id)
    if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(id, player.name)
    if (!pokemon.isAdult) throw new PokemonHasNotBornYetError(pokemon.id)
  }

  for (let i = 0; i < 6; i++) {
    await prisma.player.update({
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
      await prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          ['teamPokeId' + (i + 1)]: uniqueIds[i],
        },
      })
    }
  }

  return {
    message: ``,
    status: 200,
    data: null,
    react: `👍`,
  }
}
