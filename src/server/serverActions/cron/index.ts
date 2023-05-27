import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { iGenWildPokemon } from '../../../server/modules/imageGen/iGenWildPokemon'
import { generateWildPokemon } from '../../../server/modules/pokemon/generate/generateWildPokemon'

type TParams = {
  prismaClient: PrismaClient
  zapClient: Client
}

export const CronActions = async (data: TParams) => {
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

    const baseExperienceTreshold = Math.floor(64 + (gameRoom.level / 100) * 276)
    const basePokemons = await prismaClient.basePokemon.findMany({
      where: {
        BaseExperience: {
          lte: baseExperienceTreshold,
        },
      },
    })
    const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)]
    const level = Math.floor(Math.min(1 + Math.random() * gameRoom.level, 100))

    const newWildPokemon = await generateWildPokemon({
      baseData,
      level,
      shinyChance: 0.05,
      savage: true,
      isAdult: true,
      gameRoomId: gameRoom.id,
    })

    const imageUrl = await iGenWildPokemon({
      pokemonData: newWildPokemon,
    })
    const media = MessageMedia.fromFilePath(imageUrl!)

    const displayName = newWildPokemon.isShiny
      ? `shiny ${newWildPokemon.baseData.name}`
      : `${newWildPokemon.baseData.name}`

    data.zapClient
      .sendMessage(gameRoom.phone, media, {
        caption: `Um *${displayName}* selvagem de nível ${newWildPokemon.level} acaba de aparecer!
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
  }
}
