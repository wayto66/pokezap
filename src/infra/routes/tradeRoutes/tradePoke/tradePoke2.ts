import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IPokemon } from '../../../../server/models/IPokemon'
import { IResponse } from '../../../../server/models/IResponse'
import { ISession } from '../../../../server/models/ISession'
import { checkEvolutionPermition } from '../../../../server/modules/pokemon/checkEvolutionPermition'

export type TTradePokeParams = {
  creatorPokemon: IPokemon
  invitedPokemon: IPokemon
  session: ISession
}

export const tradePoke2 = async (data: TTradePokeParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (!data.creatorPokemon.ownerId || !data.invitedPokemon.ownerId)
    return {
      message: `ERRO" `,
      status: 400,
      data: null,
    }

  await checkEvolutionPermition({
    playerId: data.creatorPokemon.ownerId,
    pokemonId: data.creatorPokemon.id,
    fromTrade: true,
  })

  await checkEvolutionPermition({
    playerId: data.invitedPokemon.ownerId,
    pokemonId: data.invitedPokemon.id,
    fromTrade: true,
  })

  await prismaClient.pokemon.update({
    where: {
      id: data.creatorPokemon.id,
    },
    data: {
      owner: {
        connect: {
          id: data.invitedPokemon.ownerId,
        },
      },
    },
  })

  await prismaClient.pokemon.update({
    where: {
      id: data.invitedPokemon.id,
    },
    data: {
      owner: {
        connect: {
          id: data.creatorPokemon.ownerId,
        },
      },
    },
  })

  await prismaClient.session.update({
    where: {
      id: data.session.id,
    },
    data: {
      isFinished: true,
    },
  })

  return {
    message: `Troca efetuada com sucesso!`,
    status: 200,
    data: null,
  }
}
