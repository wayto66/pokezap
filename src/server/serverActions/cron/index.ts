import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { iGenWildPokemon } from '../../../server/modules/imageGen/iGenWildPokemon'
import { generateHpStat } from '../../modules/pokemon/generateHpStat'
import { generateGeneralStats } from '../../modules/pokemon/generateGeneralStats'

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

    const newWildPokemon = await prismaClient.pokemon.create({
      data: {
        basePokemonId: baseData.id,
        savage: true,
        level: level,
        isMale: Math.random() > 0.5,
        hp: generateHpStat(baseData.BaseHp, level),
        atk: generateGeneralStats(baseData.BaseAtk, level),
        def: generateGeneralStats(baseData.BaseDef, level),
        spAtk: generateGeneralStats(baseData.BaseSpAtk, level),
        spDef: generateGeneralStats(baseData.BaseSpDef, level),
        speed: generateGeneralStats(baseData.BaseSpeed, level),
        isAdult: true,
        talentId1: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId2: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId3: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId4: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId5: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId6: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId7: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId8: Math.max(Math.ceil(Math.random() * 18), 1),
        talentId9: Math.max(Math.ceil(Math.random() * 18), 1),
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

    const imageUrl = await iGenWildPokemon({
      pokemonData: newWildPokemon,
    })

    const media = MessageMedia.fromFilePath(imageUrl!)

    data.zapClient
      .sendMessage(gameRoom.phone, media, {
        caption: `Um ${newWildPokemon.baseData.name} selvagem de nível ${newWildPokemon.level} acaba de aparecer!
Ações:

👍 - Lançar pokeball
❤ - Lançar greatball

`,
      })
      .then(async result => {
        const newMessage = await prismaClient.message.create({
          data: {
            msgId: result.id.id,
            type: '?',
            body: '',
            actions: [`pokezap. catch pokeball ${newWildPokemon.id}`, `pokezap. catch greatball ${newWildPokemon.id}`],
          },
        })
      })
  }
}
