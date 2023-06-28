import { BasePokemon, Pokemon, PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PokemonBaseData } from '../../modules/duel/duelNXN'
import { generateWildPokemon } from '../../modules/pokemon/generate/generateWildPokemon'

export const npcMarketOffers = async () => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const announcedPokemons = await prismaClient.pokemon.findMany({
    where: {
      isAnnouncedInMarket: true,
    },
    include: {
      baseData: true,
    },
  })
  const basePokemons = await prismaClient.basePokemon.findMany()

  const getOffer = (pokemon: PokemonBaseData, basePokemons: BasePokemon[]) => {
    const filteredBasePokemons = basePokemons.filter(
      p =>
        p.BaseAllStats <= pokemon.baseData.BaseAllStats * 1.05 && p.BaseAllStats > pokemon.baseData.BaseAllStats * 0.8
    )

    return filteredBasePokemons[Math.floor(Math.random() * filteredBasePokemons.length)]
  }

  await prismaClient.marketOffer.deleteMany({
    where: {
      pokemonDemand: {
        some: {
          id: {
            in: announcedPokemons.map(p => p.id),
          },
        },
      },
    },
  })

  for (const announcedPokemon of announcedPokemons) {
    const pokemonToOffer = await generateWildPokemon({
      baseData: getOffer(announcedPokemon, basePokemons),
      level: announcedPokemon.level,
      isAdult: true,
      savage: false,
      shinyChance: announcedPokemon.isShiny ? 1 : 0,
    })

    const offer = await prismaClient.marketOffer.create({
      data: {
        creatorId: Math.floor(Math.random() * 200 + 50),
        demandPlayerId: announcedPokemon.ownerId || 0,
        pokemonOffer: {
          connect: {
            id: pokemonToOffer.id,
          },
        },
        pokemonDemand: {
          connect: {
            id: announcedPokemon.id,
          },
        },
      },
    })
  }
}
