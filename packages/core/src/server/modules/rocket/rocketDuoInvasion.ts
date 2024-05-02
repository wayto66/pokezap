import { GameRoom, PrismaClient } from '@prisma/client'

import { Client, MessageMedia } from 'whatsapp-web.js'
import { UnexpectedError } from '../../../infra/errors/AppErrors'
import { iGenWildPokemon } from '../imageGen/iGenWildPokemon'
import { generateWildPokemon } from '../pokemon/generate/generateWildPokemon'

type TRocketDuoInvasionParams = {
  gameRoom: GameRoom
}

export const rocketDuoInvasion = async (data: TRocketDuoInvasionParams) => {
  const prisma = container.resolve<PrismaClient>('PrismaClient')
  const zap = container.resolve<Client>('ZapClientInstance1')
  const { gameRoom } = data

  const baseExperienceTreshold = Math.min(Math.floor(64 + (gameRoom.level + 5 / 100) * 276), 280)
  const basePokemons = await prisma.basePokemon.findMany({
    where: {
      BaseExperience: {
        lte: baseExperienceTreshold,
      },
    },
    include: {
      skills: true,
    },
  })

  const rocketPokemon1 = await generateWildPokemon({
    baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
    isAdult: true,
    level: gameRoom.level + Math.floor(Math.random() * 5),
    savage: false,
    shinyChance: 0,
    gameRoomId: gameRoom.id,
  })
  const rocketPokemon2 = await generateWildPokemon({
    baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
    isAdult: true,
    level: gameRoom.level + Math.floor(Math.random() * 5),
    savage: false,
    shinyChance: 0,
    gameRoomId: gameRoom.id,
  })

  if (!rocketPokemon1) throw new UnexpectedError('Failed to create rocketpokemon1')
  if (!rocketPokemon2) throw new UnexpectedError('Failed to create rocketpokemon2')

  const announcementText = `A equipe rocket invadiu a ROTA ${gameRoom.id}!
    Para impedi-los, será necessário formar uma equipe de 2 treinadores.
    👍 - juntar-se`

  const rocketInvasion = await prisma.invasionSession.create({
    data: {
      announcementText,
      creatorId: gameRoom.id,
      gameRoomId: gameRoom.id,
      mode: '2-rocket-invasion',
      cashReward: 50 + 5 * gameRoom.level ** 1.3,
      forfeitCost: 400 + 20 * gameRoom.level ** 1.3,
      enemyPokemons: {
        connect: [{ id: rocketPokemon1.id }, { id: rocketPokemon2.id }],
      },
      // TO-DO
      name: 'Equipe rocket',
      requiredPlayers: 2,
    },
  })

  const imageUrl = await iGenWildPokemon({
    pokemon: rocketPokemon1,
  })
  const media = MessageMedia.fromFilePath(imageUrl!)
  const result = await zap.sendMessage(gameRoom.phone, media, {
    caption: announcementText,
  })
  await prisma.message.create({
    data: {
      msgId: result.id.id,
      type: '?',
      body: '',
      actions: [`pz. battle invasion ${rocketInvasion.id}`],
    },
  })
}
