import prisma from '../../../../../../prisma-provider/src'
import { IPokemon } from '../../../../server/models/IPokemon'
import { IResponse } from '../../../../server/models/IResponse'
import { ISession } from '../../../../server/models/ISession'
import { checkEvolutionPermition } from '../../../../server/modules/pokemon/checkEvolutionPermition'
import { CantProceedWithPokemonInTeamError } from '../../../errors/AppErrors'

export type TTradePokeParams = {
  creatorPokemon: IPokemon & any
  invitedPokemon: IPokemon & any
  session: ISession
}

export const tradePoke2 = async (data: TTradePokeParams): Promise<IResponse> => {
  if (!data.creatorPokemon.ownerId || !data.invitedPokemon.ownerId)
    return {
      message: `ERRO" `,
      status: 300,
      data: null,
    }

  if (
    data.creatorPokemon.teamSlot1 ||
    data.creatorPokemon.teamSlot2 ||
    data.creatorPokemon.teamSlot3 ||
    data.creatorPokemon.teamSlot4 ||
    data.creatorPokemon.teamSlot5 ||
    data.creatorPokemon.teamSlot6
  )
    throw new CantProceedWithPokemonInTeamError(data.creatorPokemon.id, data.creatorPokemon.baseData.name)

  if (
    data.invitedPokemon.teamSlot1 ||
    data.invitedPokemon.teamSlot2 ||
    data.invitedPokemon.teamSlot3 ||
    data.invitedPokemon.teamSlot4 ||
    data.invitedPokemon.teamSlot5 ||
    data.invitedPokemon.teamSlot6
  )
    throw new CantProceedWithPokemonInTeamError(data.invitedPokemon.id, data.invitedPokemon.baseData.name)

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

  await prisma.$transaction([
    prisma.marketOffer.updateMany({
      where: {
        OR: [
          {
            pokemonDemand: {
              some: {
                id: data.creatorPokemon.id,
              },
            },
          },
          {
            pokemonOffer: {
              some: {
                id: data.creatorPokemon.id,
              },
            },
          },
        ],
      },
      data: {
        active: false,
      },
    }),
    prisma.marketOffer.updateMany({
      where: {
        OR: [
          {
            pokemonDemand: {
              some: {
                id: data.invitedPokemon.id,
              },
            },
          },
          {
            pokemonOffer: {
              some: {
                id: data.invitedPokemon.id,
              },
            },
          },
        ],
      },
      data: {
        active: false,
      },
    }),

    prisma.pokemon.update({
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
    }),

    prisma.pokemon.update({
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
    }),

    prisma.session.update({
      where: {
        id: data.session.id,
      },
      data: {
        isFinished: true,
      },
    }),
  ])

  return {
    message: `Troca efetuada com sucesso!`,
    status: 200,
    data: null,
  }
}
