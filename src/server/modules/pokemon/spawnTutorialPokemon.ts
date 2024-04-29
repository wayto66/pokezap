import { GameRoom, Player, PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { iGenWildPokemon } from '../imageGen/iGenWildPokemon'
import { generateWildPokemon } from './generate/generateWildPokemon'

type TParams = {
  player: Player
  gameRoom: GameRoom
}

export const spawnTutorialPokemon = async (data: TParams) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const baseExperienceTreshold = Math.floor(64 + (1 / 100) * 276)

  const basePokemons = await prismaClient.basePokemon.findMany({
    where: {
      BaseExperience: {
        lte: baseExperienceTreshold,
      },
      isMega: false,
      isRegional: false,
      isFirstEvolution: true,
    },
    include: {
      skills: true,
    },
  })

  const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)]
  const level = 1

  const wildPokemon = await generateWildPokemon({
    baseData,
    level,
    shinyChance: 0,
    savage: true,
    isAdult: true,
    gameRoomId: data.gameRoom.id,
  })

  const imageUrl = await iGenWildPokemon({
    pokemon: wildPokemon,
  })

  return { pokemon: wildPokemon, imageUrl }
}
