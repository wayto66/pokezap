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

export const useTM = async (data: TRouteParams): Promise<IResponse> => {
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
  if (pokemon.TMs >= 3) throw new UnexpectedError('already 3 tms')

  const item = await prisma.item.findFirst({
    where: {
      baseItem: {
        name: 'tm',
      },
      ownerId: player.id,
    },
  })

  if (!item || item.amount <= 0) throw new ItemNotFoundError('tm')

  await prisma.$transaction([
    prisma.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        TMs: {
          increment: 1,
        },
      },
      include: {
        baseData: true,
        heldItem: {
          include: {
            baseItem: true,
          },
        },
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
    message: ``,
    react: '👌',
    status: 200,
    data: null,
  }
}
