import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const sendPoke = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokeIdString, targetPlayerIdString] = data.routeParams

  if (!pokeIdString) throw new MissingParameterError('id do pokemon à ser trocado')
  if (!targetPlayerIdString) throw new MissingParameterError('id do jogador que irá receber o pokemon')

  const pokeId = Number(pokeIdString)
  const targetPlayerId = Number(targetPlayerIdString)

  if (isNaN(pokeId)) throw new TypeMissmatchError(pokeIdString, 'número')
  if (isNaN(targetPlayerId)) throw new TypeMissmatchError(targetPlayerIdString, 'número')

  const prisma = container.resolve<PrismaClient>('PrismaClient')
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  const pokemon = await prisma.pokemon.findFirst({
    where: {
      id: pokeId,
    },
    include: {
      baseData: true,
    },
  })

  if (!pokemon) throw new PokemonNotFoundError(pokeId)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokeId, player.name)

  const targetPlayer = await prisma.player.findFirst({
    where: {
      id: targetPlayerId,
    },
  })

  if (!targetPlayer) throw new PlayerNotFoundError(targetPlayerIdString)
  if (pokemon.ownerId === targetPlayer.id) throw new UnexpectedError('sendPoke')

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      ownerId: targetPlayer.id,
    },
    include: {
      baseData: true,
    },
  })

  return {
    message: `*${player.name}* enviou #${pokemon.id} para *${targetPlayer.name}*.`,
    status: 200,
    data: null,
  }
}
