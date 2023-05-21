import { PrismaClient } from '@prisma/client'
import { ISession } from 'server/models/ISession'
import { container } from 'tsyringe'
import { IPokemon } from '../../../../server/models/IPokemon'
import { IResponse } from '../../../../server/models/IResponse'

export type TTradePokeParams = {
  creatorPoke: IPokemon
  invitedPoke: IPokemon
  session: ISession
}

export const tradePoke2 = async (data: TTradePokeParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (!data.creatorPoke.ownerId || !data.invitedPoke.ownerId)
    return {
      message: `ERRO" `,
      status: 400,
      data: null,
    }

  const poke1 = await prismaClient.pokemon.update({
    where: {
      id: data.creatorPoke.id,
    },
    data: {
      owner: {
        connect: {
          id: data.invitedPoke.ownerId,
        },
      },
    },
  })

  const poke2 = await prismaClient.pokemon.update({
    where: {
      id: data.invitedPoke.id,
    },
    data: {
      owner: {
        connect: {
          id: data.creatorPoke.ownerId,
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
