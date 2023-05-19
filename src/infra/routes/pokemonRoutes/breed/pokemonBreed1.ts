import { PrismaClient } from "@prisma/client"
import { TRouteParams } from "infra/routes/router"
import { container } from "tsyringe"
import { IPokemon } from "../../../../server/models/IPokemon"
import { IResponse } from "../../../../server/models/IResponse"
import { iGenPokemonBreed } from "../../../../server/modules/imageGen/iGenPokemonBreed"
import { pokemonBreed2 } from "./pokemonBreed2"

export const pokemonBreed1 = async (data: TRouteParams): Promise<IResponse> => {
  const [command, route, subroute, id1, id2, amount] = data.routeParams

  if (amount) return await pokemonBreed2(data)
  const prismaClient = container.resolve<PrismaClient>("PrismaClient")

  if (!id1 || !id2) {
    return {
      message: `ERROR: you must provide the ids for the pokemon pair to be breeded. The correct syntax would be something like:
      pokemon breed 123 456`,
      status: 400,
      data: null,
    }
  }
  const idFix1 = Number(id1.slice(id1.indexOf("#") + 1))
  const idFix2 = Number(id2.slice(id2.indexOf("#") + 1))

  if (typeof idFix1 !== "number" || typeof idFix2 !== "number") {
    return {
      message: `ERROR: something is wrong with the ids. Please verify if you are using the correct syntax.`,
      status: 400,
      data: null,
    }
  }

  const player1 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player1) {
    return {
      message: `UNEXPECTED_ERROR: no player found for phoneCode: ${data.playerPhone}`,
      status: 400,
      data: null,
    }
  }

  const pokemon1 = await prismaClient.pokemon.findFirst({
    where: {
      id: idFix1,
      ownerId: player1.id,
    },
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
    },
  })

  if (!pokemon1) {
    return {
      message: `ERROR: no pokemon found for id: ${idFix1} and player: ${player1.name}`,
      status: 400,
      data: null,
    }
  }

  const pokemon2 = await prismaClient.pokemon.findFirst({
    where: {
      id: idFix2,
      ownerId: player1.id,
    },
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
    },
  })

  if (!pokemon2) {
    return {
      message: `ERROR: no pokemon found for id: ${idFix2} and player: ${player1.name}`,
      status: 400,
      data: null,
    }
  }

  const imageUrl = await iGenPokemonBreed({
    pokemon1: pokemon1,
    pokemon2: pokemon2,
  })

  if (pokemon1.childrenId4)
    return {
      message: `#${pokemon1.id} ${pokemon1.baseData.name} já possui 3 filhotes.`,
      status: 300,
      data: null,
      imageUrl: imageUrl,
    }

  if (pokemon2.childrenId4)
    return {
      message: `#${pokemon2.id} ${pokemon2.baseData.name} já possui 3 filhotes.`,
      status: 300,
      data: null,
      imageUrl: imageUrl,
    }

  const getBreedingCosts = (poke: IPokemon) => {
    if (!poke.childrenId1) return 100
    if (!poke.childrenId2) return 200
    if (!poke.childrenId3) return 500
    if (!poke.childrenId4) return 1000
    return 9999
  }

  const totalCost = getBreedingCosts(pokemon1) + getBreedingCosts(pokemon2)

  const actions: string[] = [
    "`pokezap. pokemon breed ${pokemon1.id} ${pokemon2.id} 1`",
  ]

  if (!pokemon1.childrenId3 || !pokemon2.childrenId3)
    actions.push(`pokezap. pokemon breed ${pokemon1.id} ${pokemon2.id} 2`)
  if (!pokemon1.childrenId2 || !pokemon2.childrenId2)
    actions.push(`pokezap. pokemon breed ${pokemon1.id} ${pokemon2.id} 3`)
  if (!pokemon1.childrenId1 || !pokemon2.childrenId1)
    actions.push(`pokezap. pokemon breed ${pokemon1.id} ${pokemon2.id} 4`)

  return {
    message: `DUMMY: breeding process started for:#${pokemon1.id} ${pokemon1.baseData.name} and #${pokemon2.id} ${pokemon2.baseData.name} `,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: actions,
  }
}
