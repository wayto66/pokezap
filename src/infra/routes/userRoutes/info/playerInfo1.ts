import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError, TypeMissmatchError } from '../../../../infra/errors/AppErrors'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPlayerAnalysis } from '../../../../server/modules/imageGen/iGenPlayerAnalysis'

type TUserInfoParams = {
  playerPhone: string
  routeParams: string[]
  playerName: string
}

export const playerInfo1 = async (data: TUserInfoParams): Promise<IResponse> => {
  const [, , , playerId] = data.routeParams

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (!playerId) {
    const player = await prismaClient.player.findUnique({
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

  const player = await prismaClient.player.findUnique({
    where: { id: Number(playerId) },
  })
  if (!player) throw new PlayerNotFoundError(data.playerName)

  return {
    message: `Jogador encontrado, #${player.id} ${player.name}  `,
    status: 200,
    data: null,
  }
}
