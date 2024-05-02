import { iGenRocketInvasion } from '../../../../../image-generator/src'
import prisma from '../../../../../prisma-provider/src'
import { sendMessage } from '../../helpers/sendMessage'
import { generateWildPokemon } from '../../modules/pokemon/generate/generateWildPokemon'

export const rocketInvasion = async () => {
  const gameRooms = await prisma.gameRoom.findMany({
    where: {
      mode: 'route',
    },
    include: {
      players: true,
    },
  })

  const basePokemons = await prisma.basePokemon.findMany({
    where: {
      isMega: false,
    },
    include: {
      skills: true,
    },
  })

  for (const gameRoom of gameRooms) {
    const poke1 = await generateWildPokemon({
      level: Math.round(gameRoom.level * 1.2),
      savage: true,
      shinyChance: 0.25,
      isAdult: true,
      baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
    })

    const poke2 = await generateWildPokemon({
      level: Math.round(gameRoom.level * 1.2),
      savage: true,
      shinyChance: 0.25,
      isAdult: true,
      baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
    })

    const announcementText = `*A equipe rocket invadiu a ROTA ${gameRoom.id}!*`
    const forfeitCost = Math.round(gameRoom.level * 6 * gameRoom.players.length + 2 * gameRoom.level ** 1.3)
    const cashReward = Math.round(100 + gameRoom.level * 5 + gameRoom.level ** 1.3)

    const lootData = [
      { itemName: 'tm-case', dropChance: 0.05 },
      { itemName: 'pokeball-box', dropChance: 0.05 },
      { itemName: 'rare-candy', dropChance: 0.05 },
      { itemName: 'prop-case', dropChance: 0.05 },
    ]

    const invasionSession = await prisma.invasionSession.create({
      data: {
        name: 'Invasão Rocket!',
        announcementText,
        creatorId: gameRoom.id,
        gameRoomId: gameRoom.id,
        mode: 'rocket-invasion',
        requiredPlayers: 2,
        enemyPokemons: {
          connect: [
            {
              id: poke1.id,
            },
            {
              id: poke2.id,
            },
          ],
        },
        forfeitCost,
        cashReward,
        lootItemsDropRate: lootData,
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

    const imageUrl = await iGenRocketInvasion({
      pokemons: [poke1, poke2],
    })

    const result = await sendMessage({
      chatId: gameRoom.phone,
      imageUrl,
      options: {
        caption: `${announcementText}

        👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
`,
      },
    })

    await prisma.message.create({
      data: {
        msgId: result.id.id,
        type: 'rocket-invasion-announcement',
        body: '',
        actions: [`pz. invasion defend ${invasionSession.id}`],
      },
    })
  }
}
