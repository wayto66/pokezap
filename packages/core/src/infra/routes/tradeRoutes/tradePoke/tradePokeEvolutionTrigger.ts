import prisma from '../../../../../../prisma-provider/src'
import { IPokemon } from '../../../../server/models/IPokemon'
import { IResponse } from '../../../../server/models/IResponse'
import { ISession } from '../../../../server/models/ISession'

export type TParams = {
  creatorPokemon: IPokemon
  invitedPokemon: IPokemon
  session: ISession
}

export const tradePokeEvolutionTrigger = async (data: TParams): Promise<IResponse> => {
  if (!data.creatorPokemon.ownerId || !data.invitedPokemon.ownerId)
    return {
      message: `ERRO" `,
      status: 300,
      data: null,
    }

  await prisma.pokemon.update({
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

  await prisma.pokemon.update({
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

  await prisma.session.update({
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
