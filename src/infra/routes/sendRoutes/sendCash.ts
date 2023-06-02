import {
  InsufficientFundsError,
  MissingParameterError,
  MissingParametersTradeRouteError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  SubRouteNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { container } from 'tsyringe'
import { PrismaClient } from '@prisma/client'

export const sendCash = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , amountString, targetPlayerIdString] = data.routeParams

  if (!amountString) throw new MissingParameterError('quantidade a ser enviada')
  if (!targetPlayerIdString) throw new MissingParameterError('id do jogador que irá receber os pokecoins')

  const amount = Number(amountString)
  const targetPlayerId = Number(targetPlayerIdString)

  if (isNaN(amount)) throw new TypeMissmatchError(amountString, 'número')
  if (isNaN(targetPlayerId)) throw new TypeMissmatchError(targetPlayerIdString, 'número')

  const prisma = container.resolve<PrismaClient>('PrismaClient')
  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (player.cash < amount) throw new InsufficientFundsError(player.name, player.cash, amount)

  const targetPlayer = await prisma.player.findFirst({
    where: {
      id: targetPlayerId,
    },
  })
  if (!targetPlayer) throw new PlayerNotFoundError(targetPlayerIdString)

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      cash: {
        decrement: Math.round(amount),
      },
    },
  })

  await prisma.player.update({
    where: {
      id: targetPlayer.id,
    },
    data: {
      cash: {
        increment: Math.round(amount),
      },
    },
  })

  return {
    message: `*${player.name}* enviou $${amount} para *${targetPlayer.name}*.`,
    status: 200,
    data: null,
  }
}