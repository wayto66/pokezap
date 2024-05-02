import { iGenPlayerAnalysis } from '../../../../../../image-generator/src'
import prisma from '../../../../../../prisma-provider/src'
import { PlayerNotFoundError, TypeMissmatchError } from '../../../../infra/errors/AppErrors'
import { IResponse } from '../../../../server/models/IResponse'
import { TRouteParams } from '../../router'

export const playerInfo1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , playerId] = data.routeParams

  if (!playerId) {
    const player = await prisma.player.findUnique({
      where: {
        phone: data.playerPhone,
      },
      include: {
        ownedItems: true,
        ownedPokemons: {
          include: {
            baseData: true,
          },
        },
        teamPoke1: {
          include: {
            baseData: true,
          },
        },
        teamPoke2: {
          include: {
            baseData: true,
          },
        },
        teamPoke3: {
          include: {
            baseData: true,
          },
        },
        teamPoke4: {
          include: {
            baseData: true,
          },
        },
        teamPoke5: {
          include: {
            baseData: true,
          },
        },
        teamPoke6: {
          include: {
            baseData: true,
          },
        },
      },
    })

    if (!player) throw new PlayerNotFoundError(data.playerName)

    const imageUrl = await iGenPlayerAnalysis({
      playerData: player,
    })

    return {
      message: `#${player.id} ${player.name}  `,
      status: 200,
      data: null,
      imageUrl,
    }
  }

  if (typeof Number(playerId) !== 'number') throw new TypeMissmatchError(playerId, 'number')

  const player = await prisma.player.findUnique({
    where: { id: Number(playerId) },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  return {
    message: `Jogador encontrado, #${player.id} ${player.name}  `,
    status: 200,
    data: null,
  }
}
