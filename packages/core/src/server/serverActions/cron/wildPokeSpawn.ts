import { iGenWildPokemon } from '../../../../../image-generator/src'
import prisma from '../../../../../prisma-provider/src'
import { metaValues } from '../../../constants/metaValues'
import { sendMessage } from '../../helpers/sendMessage'
import { generateWildPokemon } from '../../modules/pokemon/generate/generateWildPokemon'
import { windPokeEvolve } from '../../modules/pokemon/windPokeEvolve'

type TParams = {
  needIncense?: boolean
}

export const wildPokeSpawn = async (data?: TParams) => {
  const gameRooms = await prisma.gameRoom.findMany({
    where: {
      statusTrashed: false,
    },
    include: {
      players: true,
    },
  })

  for (const gameRoom of gameRooms) {
    if (gameRoom.phone !== '120363269482791516@g.us') continue
    // if (gameRoom.mode !== 'route') continue
    if (gameRoom.invasorId && Math.random() < 0.5) {
      sendMessage({
        chatId: gameRoom.phone,
        content: `Um pokemon selvagem apareceu na rota, mas foi afugentado por algum invasor.
    (utilize o comando: "route verify" ou "route forfeit")`,
      })
      continue
    }

    if (
      data?.needIncense &&
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
      ? await prisma.basePokemon.findMany({
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
          include: {
            skills: true,
          },
        })
      : await prisma.basePokemon.findMany({
          where: {
            BaseExperience: {
              lte: baseExperienceTreshold,
            },
            isMega: false,
            isRegional: false,
            isFirstEvolution: true,
            OR: getIncenseTypes(),
          },
          include: {
            skills: true,
          },
        })

    const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)]
    const level = gameRoom.levelLock
      ? Math.floor(Math.min(1 + Math.random() * gameRoom.levelLock, 100))
      : Math.floor(Math.min(1 + Math.random() * gameRoom.level, 100))

    const getShinyChance = () => {
      if (!gameRoom.incenseCharges || gameRoom.incenseCharges <= 0) return 0.025
      if (gameRoom.activeIncense === 'shiny-incense') return 0.12
      return 0.085
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

    if (data?.needIncense) {
      await prisma.gameRoom.update({
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
    const displayName = newWildPokemon.isShiny
      ? `shiny ${newWildPokemon.baseData.name}`
      : `${newWildPokemon.baseData.name}`

    const response = await sendMessage({
      chatId: gameRoom.phone,
      imageUrl,
      options: {
        caption: `Um *${displayName}* selvagem de nível ${newWildPokemon.level} acaba de ${
          data?.needIncense ? 'ser atraído pelo incenso' : 'aparecer'
        }!
Ações:
👍 - Batalhar
❤ - Batalhar
`,
      },
    })

    if (!response?.id?.id) return

    await prisma.message.create({
      data: {
        msgId: response.id.id,
        type: '?',
        body: '',
        actions: [`pz. battle ${newWildPokemon.id} fast`, `pz. battle ${newWildPokemon.id} fast`],
      },
    })

    setTimeout(() => {
      pokemonRanAwayWarning({ prisma, newWildPokemon, data, gameRoom })
    }, metaValues.wildPokemonFleeTimeInSeconds * 1000)
  }
}

const pokemonRanAwayWarning = async ({ prisma, newWildPokemon, _, gameRoom }: any) => {
  const pokemon = await prisma.pokemon.findFirst({
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
    sendMessage({
      chatId: gameRoom.phone,
      content: `#${pokemon.id} - ${pokemon.baseData.name} fugiu.`,
    })
  }
}
