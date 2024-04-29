import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
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
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParameterError('Nome/Id do Pokemon')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  const pokemon = await getPokemon(prismaClient, pokemonIdString, player.id)

  if (!pokemon || !pokemon.isAdult) throw new PokemonNotFoundError(pokemonIdString)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)
  if (pokemon.level === 100) throw new UnexpectedError('already lvl 100')

  const item = await prismaClient.item.findFirst({
    where: {
      baseItem: {
        name: 'rare-candy',
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError('rare-candy')

  await prismaClient.$transaction([
    prismaClient.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        experience: (pokemon.level + 1) ** 3,
        level: pokemon.level + 1,
      },
    }),

    prismaClient.item.update({
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
