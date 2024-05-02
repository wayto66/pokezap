import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  CantSellPokemonInTeamError,
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
  ZeroPokemonsFoundError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

enum FilterTypes {
  'EGG',
  'EGGS',
}

export const sellManyPokemon = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , filterType, valueString] = data.routeParams

  if (!['EGG', 'EGGS'].includes(filterType)) throw new UnexpectedError('Apenas permitido o filtro "egg"')
  if (!valueString) throw new MissingParameterError('Quantidade mínima de ovos para vender o pokemon')
  const value = Number(valueString)
  if (isNaN(value)) throw new TypeMissmatchError(valueString, 'NÚMERO')
  if (![2, 3, 4].includes(value)) throw new UnexpectedError('Só é permitido valores: 2, 3 ou 4')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: true,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemons = await prisma.pokemon.findMany({
    where: {
      childrenId1: {
        not: null,
      },
      childrenId2: {
        not: null,
      },
      childrenId3: {
        [value > 2 ? 'equals' : 'not']: null,
      },
      childrenId4: {
        [value > 3 ? 'equals' : 'not']: null,
      },
      ownerId: player.id,
      isAdult: true,
    },
    include: {
      baseData: true,
      teamSlot1: true,
      teamSlot2: true,
      teamSlot3: true,
      teamSlot4: true,
      teamSlot5: true,
      teamSlot6: true,
      owner: true,
    },
  })
  if (pokemons.length === 0) throw new ZeroPokemonsFoundError()

  let totalCash = 0

  for (const pokemon of pokemons) {
    if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)
    if (
      pokemon.teamSlot1 ||
      pokemon.teamSlot2 ||
      pokemon.teamSlot3 ||
      pokemon.teamSlot4 ||
      pokemon.teamSlot5 ||
      pokemon.teamSlot6
    )
      throw new CantSellPokemonInTeamError(pokemon.id)

    const pokemonSellPrice = Math.floor(
      35 + (pokemon.level ** 2 / 150) * 100 + (pokemon.baseData.BaseExperience ** 2 / 1200) * 50
    )

    totalCash += pokemonSellPrice
  }

  if (data.fromReact && data.routeParams[data.routeParams.length - 1] === 'CONFIRM') {
    await prisma.pokemon.updateMany({
      where: {
        id: {
          in: pokemons.map(p => p.id),
        },
      },
      data: {
        ownerId: null,
        gameRoomId: null,
        statusTrashed: true,
      },
    })

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          increment: totalCash,
        },
      },
    })
    return {
      message: `${data.playerName} vendeu ${pokemons
        .map(poke => {
          return `#${poke.id} ${poke.baseData.name}`
        })
        .join(', ')} e obteve $${totalCash}.`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Deseja vender ${pokemons
      .map(poke => {
        return `#${poke.id} ${poke.baseData.name}`
      })
      .join(', ')} por $${totalCash}?
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    actions: [`pz. sell poke ${pokemons.map(poke => poke.id).join(' ')} confirm`],
  }
}
