import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { metaValues } from '../../../constants/metaValues'
import { iGenWildPokemon } from '../../modules/imageGen/iGenWildPokemon'
import { generateWildPokemon } from '../../modules/pokemon/generate/generateWildPokemon'
import { windPokeEvolve } from '../../modules/pokemon/windPokeEvolve'

type TParams = {
  prismaClient: PrismaClient
  zapClient: Client
  needIncense?: boolean
}

export const wildPokeSpawn = async (data: TParams) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const gameRooms = await prismaClient.gameRoom.findMany({
    where: {
      statusTrashed: false,
    },
    include: {
      players: true,
    },
  })

  for (const gameRoom of gameRooms) {
    if (!gameRoom.phone) continue
    if (gameRoom.mode !== 'route') continue
    if (gameRoom.invasorId && Math.random() < 0.5) {
      data.zapClient.sendMessage(
        gameRoom.phone,
        `Um pokemon selvagem apareceu na rota, mas foi afugentado por algum invasor.
    (utilize o comando: route verify.)`
      )
      continue
    }

    if (
      data.needIncense &&
      (!gameRoom.activeIncense ||
        gameRoom.activeIncense === 'none' ||
        !gameRoom.incenseCharges ||
        gameRoom.incenseCharges <= 0)
    )
      continue
    const baseExperienceTreshold = Math.floor(64 + (gameRoom.level / 100) * 276)

    const getIncenseTypes = () => {
      if (gameRoom.incenseElements.length > 0) {
        return [
          {
            type1Name: {
              in: gameRoom.incenseElements,
            },
          },
          {
            type2Name: {
              in: gameRoom.incenseElements,
            },
          },
        ]
      }
      return undefined
    }

    const basePokemons = gameRoom.region
      ? await prismaClient.basePokemon.findMany({
          where: {
            BaseExperience: {
              lte: baseExperienceTreshold,
            },
            name: {
              contains: `-${gameRoom.region}`,
            },
            isMega: false,
            isRegional: true,
            OR: getIncenseTypes(),
          },
        })
      : await prismaClient.basePokemon.findMany({
          where: {
            BaseExperience: {
              lte: baseExperienceTreshold,
            },
            isMega: false,
            isRegional: false,
            isFirstEvolution: true,
            OR: getIncenseTypes(),
          },
        })

    const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)]
    const level = gameRoom.levelLock
      ? Math.floor(Math.min(1 + Math.random() * gameRoom.levelLock, 100))
      : Math.floor(Math.min(1 + Math.random() * gameRoom.level, 100))

    const getShinyChance = () => {
      if (!gameRoom.incenseCharges || gameRoom.incenseCharges <= 0) return 0.025
      if (gameRoom.activeIncense === 'shiny-incense') return 0.09
      return 0.05
    }

    const shinyChance = getShinyChance()

    const newWildPokemonPreEvolve = await generateWildPokemon({
      baseData,
      level,
      shinyChance,
      savage: true,
      isAdult: true,
      gameRoomId: gameRoom.id,
      fromIncense: true,
    })

    const newWildPokemon = await windPokeEvolve(
      await windPokeEvolve(newWildPokemonPreEvolve, baseExperienceTreshold),
      baseExperienceTreshold
    )

    if (data.needIncense) {
      await prismaClient.gameRoom.update({
        where: {
          id: gameRoom.id,
        },
        data: {
          incenseCharges: {
            decrement: 1,
          },
        },
      })
    }

    const imageUrl = await iGenWildPokemon({
      pokemon: newWildPokemon,
    })
    const media = MessageMedia.fromFilePath(imageUrl!)

    const displayName = newWildPokemon.isShiny
      ? `shiny ${newWildPokemon.baseData.name}`
      : `${newWildPokemon.baseData.name}`

    data.zapClient
      .sendMessage(gameRoom.phone, media, {
        caption: `Um *${displayName}* selvagem de nível ${newWildPokemon.level} acaba de ${
          data.needIncense ? 'ser atraído pelo incenso' : 'aparecer'
        }!
Ações:
👍 - Batalhar
❤ - Batalha Rápida
`,
      })
      .then(async result => {
        await prismaClient.message.create({
          data: {
            msgId: result.id.id,
            type: '?',
            body: '',
            actions: [`pokezap. battle ${newWildPokemon.id}`, `pz. battle ${newWildPokemon.id} fast`],
          },
        })
      })

    setTimeout(() => {
      pokemonRanAwayWarning({ prismaClient, newWildPokemon, data, gameRoom })
    }, metaValues.wildPokemonFleeTimeInSeconds * 1000)
  }
}

const pokemonRanAwayWarning = async ({ prismaClient, newWildPokemon, data, gameRoom }: any) => {
  const pokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: newWildPokemon.id,
    },
    include: {
      defeatedBy: true,
      baseData: true,
    },
  })

  if (!pokemon) return
  if (pokemon.defeatedBy.length === 0) {
    data.zapClient.sendMessage(gameRoom.phone, `#${pokemon.id} - ${pokemon.baseData.name} fugiu.`)
  }
}
