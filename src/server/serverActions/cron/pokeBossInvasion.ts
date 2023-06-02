import { PrismaClient } from '@prisma/client'
import { bossInvasionLootMap } from '../../../server/constants/bossInvasionLootMap'
import { bossPokemonNames } from '../../../server/constants/bossPokemonNames'
import { generateBossPokemon } from '../../../server/modules/pokemon/generate/generateBossPokemon'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { iGenPokeBossInvasion } from '../../../server/modules/imageGen/iGenPokeBossInvasion'

type TPokeBossInvasion = {
  zapClient: Client
}

export const pokeBossInvasion = async (data: TPokeBossInvasion) => {
  const prisma = container.resolve<PrismaClient>('PrismaClient')

  const bossesBaseData = await prisma.basePokemon.findMany({
    where: {
      name: {
        in: bossPokemonNames,
      },
    },
  })

  const gameRooms = await prisma.gameRoom.findMany({
    where: {
      mode: 'route',
    },
    include: {
      players: true,
    },
  })

  for (const gameRoom of gameRooms) {
    if (gameRoom.invasorId || gameRoom.level < 14) continue

    const pokeBoss = await generateBossPokemon({
      baseData: bossesBaseData[Math.floor(Math.random() * bossesBaseData.length)],
      level: gameRoom.level * 2.5,
      savage: true,
      shinyChance: 0.3,
    })

    const displayName = pokeBoss.isShiny
      ? `SHINY ${pokeBoss.baseData.name.toUpperCase()}`
      : pokeBoss.baseData.name.toUpperCase()

    const announcementText = `Um *${displayName}* nível ${pokeBoss.level} invadiu a ROTA ${gameRoom.id}!`
    const forfeitCost = Math.round(gameRoom.level * 10 * gameRoom.players.length + 2 * gameRoom.level ** 1.5)
    const cashReward = Math.round(200 + gameRoom.level * 10 + 2 * gameRoom.level ** 1.6)
    const lootItemsDropRate = bossInvasionLootMap.get(pokeBoss.baseData.name)

    const invasionSession = await prisma.invasionSession.create({
      data: {
        name: 'Invasão: ' + displayName,
        announcementText,
        creatorId: gameRoom.id,
        gameRoomId: gameRoom.id,
        mode: 'boss-invasion',
        requiredPlayers: Math.max(2, Math.ceil(gameRoom.players.length / 2)),
        enemyPokemons: {
          connect: {
            id: pokeBoss.id,
          },
        },
        forfeitCost,
        cashReward,
        lootItemsDropRate,
      },
    })

    await prisma.gameRoom.update({
      where: {
        id: gameRoom.id,
      },
      data: {
        invasorId: invasionSession.id,
      },
    })

    const imageUrl = await iGenPokeBossInvasion({
      invasionSession,
      pokeBoss,
    })
    const media = MessageMedia.fromFilePath(imageUrl)

    const result = await data.zapClient.sendMessage(gameRoom.phone, media, {
      caption: `${announcementText}

        👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
`,
    })

    await prisma.message.create({
      data: {
        msgId: result.id.id,
        type: 'poke-boss-invasion-announcement',
        body: '',
        actions: [`pz. invasion defend ${invasionSession.id}`],
      },
    })
  }
}