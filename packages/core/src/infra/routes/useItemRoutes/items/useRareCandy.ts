import prisma from '../../../../../../prisma-provider/src'
import { getPokemon } from '../../../../server/helpers/getPokemon'
import { IResponse } from '../../../../server/models/IResponse'
import {
  ItemNotFoundError,
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const useRareCandy = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParameterError('Nome/Id do Pokemon')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  const pokemon = await getPokemon(prisma, pokemonIdString, player.id)

  if (!pokemon || !pokemon.isAdult) throw new PokemonNotFoundError(pokemonIdString)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)
  if (pokemon.level === 100) throw new UnexpectedError('already lvl 100')

  const item = await prisma.item.findFirst({
    where: {
      baseItem: {
        name: 'rare-candy',
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError('rare-candy')

  await prisma.$transaction([
    prisma.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        experience: (pokemon.level + 1) ** 3,
        level: pokemon.level + 1,
      },
    }),

    prisma.item.update({
      where: {
        id: item.id,
      },
      data: {
        amount: {
          decrement: 1,
        },
      },
    }),
  ])

  return {
    message: `*${pokemon.nickName ?? pokemon.baseData.name}* come o rare-candy e avança para o nível ${(
      pokemon.level + 1
    ).toString()} !`,
    status: 200,
    data: null,
  }
}
