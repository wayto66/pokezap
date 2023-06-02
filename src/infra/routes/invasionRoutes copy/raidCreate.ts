import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { raidsDataMap } from '../../../server/constants/raidsDataMap'
import { IResponse } from '../../../server/models/IResponse'
import { generateRaidPokemon } from '../../../server/modules/pokemon/generate/generateRaidPokemon'
import {
  MissingParameterError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  RaidDataNotFoundError,
  RouteNotFoundError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const raidCreate = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , raidName, confirm] = data.routeParams
  if (!raidName) throw new MissingParameterError('Nome da raid à ser criada')

  const raidData = raidsDataMap.get(raidName.toLowerCase())
  if (!raidData) throw new RaidDataNotFoundError(raidName)

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: true,
      gameRooms: true,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (!player.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player.name)

  const gameRoom = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
  })

  if (!gameRoom) throw new RouteNotFoundError(player.name, data.groupCode)

  if (confirm && confirm === 'CONFIRM') {
    const announcementText = `RAID: ${raidName}!`

    // TODO: MEGA
    // const boss = await generateMegaPokemon({})

    const raid = await prismaClient.raid.create({
      data: {
        announcementText,
        cashReward: 100,
        creatorId: player.id,
        forfeitCost: 300,
        gameRoomId: gameRoom.id,
        mode: 'raid',
        name: `RAID : ${raidName}!`,
        requiredPlayers: 3,
      },
    })

    const enemiesData: any[] = []

    for (const enemy of raidData.enemies) {
      enemiesData.push(
        generateRaidPokemon({
          isAdult: true,
          level: Math.round(gameRoom.level * 1.5),
          name: enemy,
          savage: false,
          shinyChance: 0.1,
          fromIncense: false,
          gameRoomId: gameRoom.id,
        })
      )
      enemiesData.push(
        generateRaidPokemon({
          isAdult: true,
          level: Math.round(gameRoom.level * 1.5),
          name: enemy,
          savage: false,
          shinyChance: 0.1,
          fromIncense: false,
          gameRoomId: gameRoom.id,
        })
      )
    }

    await Promise.all(enemiesData)

    const getRandomPokemons = (array: any[], amount: number) => {
      const shuffledArray = array.slice() // Create a copy of the array
      let currentIndex = shuffledArray.length

      // While there are elements remaining to shuffle
      while (currentIndex > 0) {
        // Pick a random index from the remaining elements
        const randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // Swap the current element with the randomly selected element
        const temporaryValue = shuffledArray[currentIndex]
        shuffledArray[currentIndex] = shuffledArray[randomIndex]
        shuffledArray[randomIndex] = temporaryValue
      }

      // Return the desired number of elements from the shuffled array
      return shuffledArray.slice(0, amount)
    }

    const createRoomsData: any[] = []

    for (let i = 0; i < raidData.rooms; i++) {
      const enemyAmount = Math.floor(Math.random() * 3 + 1)
      const enemies = getRandomPokemons(enemiesData, enemyAmount)
      createRoomsData.push({
        announcementText: `SALA  DA RAID ${raidName}.`,
        creatorId: player.id,
        gameRoomId: gameRoom.id,
        isFinalRoom: false,
        mode: 'raid-room',
        name: 'SALA ',
        requiredPlayers: raid.requiredPlayers,
        raidId: raid.id,
        enemiesIds: enemies.map(p => p.id),
      })
    }

    await prismaClient.raidRoom.createMany({
      data: createRoomsData,
    })

    return {
      message: `*${player.name}* inicou uma caravana para RAID ${raidName} por $${200}.
    👍 - Juntar-se`,
      status: 200,
      data: null,
      actions: [`pz. raid join ${raid.id}`],
    }
  }

  return {
    message: `Deseja criar uma caravana para RAID ${raidName} por $${200}?
    👍 - Confirmar`,
    status: 200,
    data: null,
    actions: [`pz. raid create ${raidName} confirm`],
  }
}
