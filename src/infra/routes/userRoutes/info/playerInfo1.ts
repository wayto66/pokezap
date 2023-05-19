import { PrismaClient } from "@prisma/client"
import { container } from "tsyringe"
import { IResponse } from "../../../../server/models/IResponse"
import { iGenPlayerAnalysis } from "../../../../server/modules/imageGen/iGenPlayerAnalysis"

type TUserInfoParams = {
  playerPhone: string
  routeParams: string[]
  playerName: string
}

export const playerInfo1 = async (
  data: TUserInfoParams
): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>("PrismaClient")

  const [command, route, subRoute, playerId] = data.routeParams

  if (!playerId) {
    if (!data.playerPhone) {
      return {
        message:
          "ERRO: código de telefone não encontrado para o jogador: " +
          data.playerName,
        status: 400,
        data: null,
      }
    }
    const player = await prismaClient.player.findUnique({
      where: {
        phone: data.playerPhone,
      },
      include: {
        ownedItems: true,
        ownedHeldItems: true,
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

    if (!player) {
      return {
        message:
          "ERRO: Jogador não encontrado para o código de telefone: " +
          data.playerPhone,
        status: 400,
        data: null,
      }
    }

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

  if (typeof Number(playerId) !== "number") {
    return {
      message: `ERROR: ${playerId} is not a number.`,
      status: 400,
      data: null,
    }
  }

  const player = await prismaClient.player.findUnique({
    where: { id: Number(playerId) },
  })

  if (!player) {
    return {
      message: "ERRO: Jogador não encontrado para o código: " + playerId,
      status: 400,
      data: null,
    }
  }

  return {
    message: `DUMMY: Jogador encontrado, #${player.id} ${player.name}  `,
    status: 200,
    data: null,
  }
}
