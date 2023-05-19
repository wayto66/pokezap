import { PrismaClient } from "@prisma/client"
import { IResponse } from "server/models/IResponse"
import { container } from "tsyringe"

type TParams = {
  playerPhone: string
  routeParams: string[]
  playerName: string
}

export const pokeballCatch = async (data: TParams): Promise<IResponse> => {
  console.log({ pbcatch: data })
  const [initializer, thisRoute, ballType, givenId] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>("PrismaClient")

  const pokeId = Number(givenId)
  if (!pokeId || typeof pokeId !== "number") {
    return {
      message: `Por favor, forneca o ID do pokemon à ser capturado. Exemplo:
        poke**p. catch pokebola 25`,
      status: 300,
      data: null,
    }
  }

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  if (!player)
    return {
      message: `ERRO: Jogador não encontrado com o código ${data.playerPhone}`,
      status: 400,
      data: null,
    }

  const pokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: pokeId,
    },
    include: {
      baseData: true,
      defeatedBy: true,
    },
  })

  if (!pokemon)
    return {
      message: `ERRO: Pokemon não encontrado com o id ${pokeId}`,
      status: 400,
      data: null,
    }

  if (!pokemon?.savage) {
    return {
      message: `ERRO: Pokemon: #${pokeId} - ${pokemon.baseData.name} já foi capturado por outro jogador.`,
      status: 400,
      data: null,
    }
  }

  const pokeball = await prismaClient.item.findFirst({
    where: {
      ownerId: player.id,
      baseItem: {
        name: "poke-ball",
      },
    },
    include: {
      baseItem: true,
    },
  })

  if (!pokeball || pokeball.amount <= 0) {
    return {
      message: `${data.playerName} não possui nenhuma pokeball.`,
      status: 300,
      data: null,
    }
  }

  function calculateCatchRate(baseExp: number): number {
    const x = (baseExp + 10) / 304 // scale baseExp from 36-340 to 0-1
    const catchRate = 1 - Math.exp(-3 * x)
    return Math.min(1 - catchRate)
  }

  const catchRate = calculateCatchRate(pokemon.baseData.BaseExperience)

  await prismaClient.item.updateMany({
    where: {
      id: pokeball.id,
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  })

  if (catchRate > Math.random()) {
    await prismaClient.pokemon.updateMany({
      where: {
        id: pokemon.id,
      },
      data: {
        savage: false,
        ownerId: player.id,
      },
    })
    return {
      message: `${pokemon.baseData.name.toUpperCase()} foi capturado por ${
        data.playerName
      }!`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Sinto muito ${data.playerName}, sua pokebóla quebrou. Restam ${
      pokeball.amount - 1
    } pokebólas.`,
    status: 200,
    data: null,
    react: "😢",
  }
}
