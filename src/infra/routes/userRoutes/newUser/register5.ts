import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { duelNXN } from '../../../../server/modules/duel/duelNXN'
import { PlayerNotFoundError, UnexpectedError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const register5 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  const wildPokemonId = Number(pokemonIdString)
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
    },
  })
  const wildPokemon = await prismaClient.pokemon.findUnique({
    where: {
      id: wildPokemonId,
    },
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  })
  if (!player || !wildPokemon) throw new PlayerNotFoundError(data.playerPhone)
  if (!player.teamPoke1) throw new UnexpectedError('Não há um pokemon em seu time')

  const duel = await duelNXN({
    leftTeam: [player.teamPoke1],
    rightTeam: [wildPokemon],
    wildBattle: true,
    staticImage: true,
    forceWin: true,
  })
  if (!duel) throw new UnexpectedError('Duelo não concluido')

  return {
    message: `[d] Você derrotou o ${wildPokemon.baseData.name} selvagem! 

    Utilize o comando "pz. buy poke-ball 1"
    Depois reaja nessa mensagem pra tentar capturá-lo!

    👍 - Jogar poke-bola
    `,
    status: 200,
    imageUrl: duel.imageUrl,
    isAnimated: true,
    data: null,
    actions: [`pz. start 6 ${wildPokemon.id}`],
  }
}
