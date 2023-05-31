import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { iGenWildPokemon } from '../../modules/imageGen/iGenWildPokemon'
import { generateWildPokemon } from '../../modules/pokemon/generate/generateWildPokemon'
import { metaValues } from '../../../constants/metaValues'

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
    if (!gameRoom.phone) {
      console.error('No phone available for gameRoom: ' + gameRoom.id)
      continue
    }
    if (gameRoom.mode !== 'route') continue
    if (
      data.needIncense &&
      (!gameRoom.activeIncense ||
        gameRoom.activeIncense === 'none' ||
        !gameRoom.incenseCharges ||
        gameRoom.incenseCharges <= 0)
    )
      continue

    const baseExperienceTreshold = Math.floor(64 + (gameRoom.level / 100) * 276)
    const basePokemons = await prismaClient.basePokemon.findMany({
      where: {
        BaseExperience: {
          lte: baseExperienceTreshold,
        },
      },
    })
    const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)]
    const level = gameRoom.levelLock
      ? Math.floor(Math.min(1 + Math.random() * gameRoom.levelLock, 100))
      : Math.floor(Math.min(1 + Math.random() * gameRoom.level, 100))

    const newWildPokemon = await generateWildPokemon({
      baseData,
      level,
      shinyChance: data.needIncense ? 0.05 : 0.025,
      savage: true,
      isAdult: true,
      gameRoomId: gameRoom.id,
      fromIncense: true,
    })

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
      pokemonData: newWildPokemon,
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
`,
      })
      .then(async result => {
        const newMessage = await prismaClient.message.create({
          data: {
            msgId: result.id.id,
            type: '?',
            body: '',
            actions: [`pokezap. battle ${newWildPokemon.id}`],
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
