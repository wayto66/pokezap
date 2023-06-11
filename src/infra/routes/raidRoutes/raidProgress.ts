import { PrismaClient, PrismaPromise } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { duelNXN } from '../../../server/modules/duel/duelNXN'
import {
  InvasionAlreadyFinishedError,
  InvasionNotFoundError,
  MissingParameterError,
  PlayerNotFoundError,
  RoomDoesNotExistsInRaidError,
  SendEmptyMessageError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { raidsDataMap } from '../../../server/constants/raidsDataMap'
import { raidDifficultyDataMap } from './raidCreate'
import { logger } from '../../logger'
import { handleExperienceGain } from '../../../server/modules/pokemon/handleExperienceGain'

export const raidProgress = async (data: TRouteParams): Promise<IResponse> => {
  const [, , selectType, raidIdString, roomIdString] = data.routeParams
  if (!data.fromReact) throw new UnexpectedError('Rota não permitida.')
  if (!raidIdString) throw new MissingParameterError('raid id')
  if (!roomIdString) throw new MissingParameterError('room id')

  const raidId = Number(raidIdString)
  if (isNaN(raidId)) throw new TypeMissmatchError(raidIdString, 'número')
  const roomId = Number(roomIdString)
  if (isNaN(roomId)) throw new TypeMissmatchError(roomIdString, 'número')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const raid = await prismaClient.raid.findFirst({
    where: {
      id: raidId,
    },
    include: {
      raidRooms: {
        include: {
          defeatedPokemons: true,
          winnerPokemons: {
            include: {
              baseData: {
                include: {
                  skills: true,
                },
              },
              heldItem: {
                include: {
                  baseItem: true,
                },
              },
            },
          },
          enemyPokemons: {
            include: {
              baseData: {
                include: {
                  skills: true,
                },
              },
            },
          },
        },
      },
      lobbyPokemons: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
        },
      },
    },
  })

  if (!raid) throw new InvasionNotFoundError(raidIdString)
  if (raid.isFinished) throw new InvasionAlreadyFinishedError()

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const currentRoom = await prismaClient.raidRoom.findFirst({
    where: {
      id: roomId,
    },
    include: {
      lobbyPokemons: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
          heldItem: {
            include: {
              baseItem: true,
            },
          },
          owner: true,
        },
      },
      enemyPokemons: {
        include: {
          baseData: {
            include: {
              skills: true,
            },
          },
        },
      },
    },
  })

  if (!currentRoom) throw new RoomDoesNotExistsInRaidError(roomId, raid.name)
  if (currentRoom.lobbyPokemons.length !== raid.requiredPlayers)
    throw new UnexpectedError(`Lobby pokemons not equal to required players in room ${currentRoom.id}`)
  if (currentRoom.enemyPokemons.length === 0) throw new UnexpectedError(`No enemy pokemons in room ${currentRoom.id}`)

  const currentRoomIndex = raid.raidRooms.findIndex(r => r.id === currentRoom.id)

  const duel = await duelNXN({
    leftTeam: currentRoom.lobbyPokemons,
    rightTeam: currentRoom.enemyPokemons,
    returnOnlyPlayerPokemonDefeatedIds: true,
    backgroundTypeName: raid.raidRooms[raid.raidRooms.length - 1].enemyPokemons[0].baseData.type1Name,
  })

  if (!duel) throw new UnexpectedError('no duel data in room: ' + currentRoom.id)

  console.log({ duel })

  // handle lose scenario
  if (duel.loserTeam.map(p => p.ownerId).includes(currentRoom.lobbyPokemons[0].ownerId)) {
    await prismaClient.raid.update({
      where: {
        id: raid.id,
      },
      data: {
        isFinished: true,
        isInProgress: false,
        inInLobby: false,
      },
    })
    await prismaClient.$transaction(
      raid.lobbyPokemons.map(poke =>
        prismaClient.player.update({
          where: {
            id: poke.ownerId ?? 0,
          },
          data: {
            isInRaid: false,
            cash: {
              decrement: Math.round(raid.cashReward * 0.2),
            },
          },
        })
      )
    )
    if (currentRoom.isFinalRoom) {
      // TODO: give player rewards
      return {
        message: `A equipe de raid enfrenta ${currentRoom.enemyPokemons[0].baseData.name.toUpperCase()}!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        isAnimated: true,
        afterMessage: `${currentRoom.enemyPokemons[0].baseData.name.toUpperCase()} derrotou a equipe de raid.
        
        ${duel.damageDealtMessage}`,
        afterMessageDelay: 10000,
      }
    }
    return {
      message: `A equipe de raid enfrenta a sala ${currentRoomIndex} de ${raid.name}!`,
      status: 200,
      data: null,
      imageUrl: duel.imageUrl,
      isAnimated: true,
      afterMessage: `${duel.damageDealtMessage}
      
      A equipe de raid foi derrotada.`,
      afterMessageDelay: 10000,
    }
  }

  // handle raid end win scenario
  if (currentRoom.isFinalRoom) {
    const raidLootData = raidsDataMap.get(currentRoom.enemyPokemons[0].baseData.name)
    const raidDifficultyData = raidDifficultyDataMap.get(raid.difficulty)
    const lootMessages: string[] = []
    if (!raidLootData)
      throw new UnexpectedError(' no raidlootdata found for : ' + currentRoom.enemyPokemons[0].baseData.name)
    if (!raidDifficultyData) throw new UnexpectedError(' no raidDifficultyData found for : ' + raid.difficulty)

    const prismaPromises: PrismaPromise<any>[] = []
    for (const player of currentRoom.lobbyPokemons.map(p => p.owner)) {
      if (!player) {
        logger.error('No player found')
        continue
      }
      for (const loot of raidLootData.loot) {
        if (Math.random() < loot.dropRate * raidDifficultyData.dropRate) {
          const amount = Math.floor(Math.random() * loot.amount[1] + loot.amount[0])
          lootMessages.push(`${player.name} obteve ${amount} *${loot.name}*`)
          prismaPromises.push(
            prismaClient.item.upsert({
              create: {
                name: loot.name,
                amount,
                ownerId: player.id,
              },
              update: {
                amount: {
                  increment: amount,
                },
              },
              where: {
                ownerId_name: {
                  ownerId: player.id,
                  name: loot.name,
                },
              },
            })
          )
        }
      }
    }

    await prismaClient.$transaction(prismaPromises)
    const levelupMessages: string[] = []

    for (const pokemon of currentRoom.lobbyPokemons) {
      const response = await handleExperienceGain({
        pokemon,
        targetPokemon: currentRoom.enemyPokemons[0],
      })
      if (response.leveledUp)
        levelupMessages.push(`${pokemon.baseData.name} avançou para o nível ${pokemon.level + 1}!`)
    }

    await prismaClient.player.updateMany({
      where: {
        id: {
          in: raid.lobbyPokemons.map(p => p.ownerId || 0),
        },
      },
      data: {
        cash: {
          increment: raidDifficultyData.cashReward,
        },
        isInRaid: false,
      },
    })

    return {
      message: `A equipe de raid enfrenta ${currentRoom.enemyPokemons[0].baseData.name.toUpperCase()}!
     `,
      status: 200,
      data: null,
      imageUrl: duel.imageUrl,
      isAnimated: true,
      afterMessage: `${raid.name} foi derrotado! A equipe de raid venceu!
      ${duel.damageDealtMessage}
           
      ${levelupMessages.join('\n')}
      ${lootMessages.join('\n')}`,
      afterMessageDelay: 15000,
    }
  }

  console.log('h1')

  const currentRoomIndexInArray = raid.raidRooms.findIndex(r => r.id === roomId)
  const nextRoom = raid.raidRooms[currentRoomIndexInArray + 1]

  if (!nextRoom) throw new UnexpectedError('no next room for currentRoomIndexInArray: ' + currentRoomIndexInArray)

  await prismaClient.raid.update({
    where: {
      id: raid.id,
    },
    data: {
      defeatedPokemons: {
        connect: duel.defeatedPokemonsIds?.map(id => {
          return { id: id }
        }),
      },
      currentRoomIndex: nextRoom.id,
    },
  })

  const raidCreator = await prismaClient.player.findUnique({
    where: {
      id: raid.creatorId,
    },
  })

  if (!raidCreator) throw new PlayerNotFoundError(raid.creatorId.toString())

  return {
    message: `A equipe de raid enfrenta a sala ${currentRoomIndex} de ${raid.name}!`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    isAnimated: true,
    afterMessage: `${duel.damageDealtMessage}

    *${player.name}* deve confirmar o avanço na raid.
    👍 - Prosseguir raid`,
    afterMessageDelay: 10000,
    afterMessageActions: [`pz. raid select-onlycreator ${raid.id} ${nextRoom.id} `],
  }
}
