import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { duelNXN } from '../../../server/modules/duel/duelNXN'
import {
  InvasionAlreadyFinishedError,
  InvasionNotFoundError,
  MissingParameterError,
  MissingParametersBattleRouteError,
  PlayerDoesNotBelongToRaidTeamError,
  PlayerDoesNotHaveReviveForPokemonInRaidError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  RaidAlreadyFinishedError,
  RaidNotFoundError,
  RoomAlreadyFinishedError,
  RoomDoesNotExistsInRaidError,
  SendEmptyMessageError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { raidProgress } from './raidProgress'
import { Client } from 'whatsapp-web.js'
import { iGenRaidNextRoom } from '../../../server/modules/imageGen/iGenRaidNextRoom'

export const raidRoomSelect = async (data: TRouteParams): Promise<IResponse> => {
  const [, , selectType, raidIdString, roomIdString, confirm] = data.routeParams
  if (!data.fromReact) throw new UnexpectedError('Rota não permitida.')
  if (!raidIdString) throw new MissingParameterError('Id da raid')
  if (!roomIdString) throw new MissingParameterError('Id da sala da raid')

  const raidId = Number(raidIdString)
  if (isNaN(raidId)) throw new TypeMissmatchError(raidIdString, 'número')
  const roomId = Number(roomIdString)
  if (isNaN(roomId)) throw new TypeMissmatchError(roomIdString, 'número')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: {
        include: {
          baseData: true,
        },
      },
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (!player.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(player.name)

  const raid = await prismaClient.raid.findFirst({
    where: {
      id: raidId,
    },
    include: {
      defeatedPokemons: true,
      winnerPokemons: true,
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
          owner: true,
        },
      },
    },
  })

  if (!raid) throw new RaidNotFoundError(raidIdString)
  if (raid.isFinished) throw new RaidAlreadyFinishedError()
  if (raid.raidRooms.find(room => room.id === roomId)?.isFinished) throw new RoomAlreadyFinishedError(roomId)
  if (!raid.lobbyPokemons.map(poke => poke.ownerId).includes(player.id))
    throw new PlayerDoesNotBelongToRaidTeamError(player.name)
  if (player.id !== raid.creatorId && selectType === 'SELECT-ONLYCREATOR') throw new SendEmptyMessageError()

  const currentRoom = raid.raidRooms.find(room => room.id === roomId)
  if (!currentRoom) throw new RoomDoesNotExistsInRaidError(roomId, raid.name)

  if (confirm && confirm === 'CONFIRM') {
    const keyItems = await prismaClient.item.findMany({
      where: {
        baseItem: {
          name: {
            in: ['potion', 'revive'],
          },
        },
        ownerId: player.id,
      },
      include: {
        baseItem: true,
      },
    })

    const revive = keyItems.find(item => item.baseItem.name === 'revive')
    const potion = keyItems.find(item => item.baseItem.name === 'potion')
    if (raid.defeatedPokemons.map(poke => poke.id).includes(player.teamPoke1.id)) {
      if (!revive || revive.amount <= 0)
        throw new PlayerDoesNotHaveReviveForPokemonInRaidError(player.name, player.teamPoke1.baseData.name)
      await prismaClient.item.update({
        where: {
          id: revive.id,
        },
        data: {
          amount: {
            decrement: 1,
          },
        },
      })
    }

    await prismaClient.raid.update({
      where: {
        id: raid.id,
      },
      data: {
        defeatedPokemons: {
          disconnect: {
            id: player.teamPoke1.id,
          },
        },
      },
    })

    const updatedRoom = await prismaClient.raidRoom.update({
      where: {
        id: roomId,
      },
      data: {
        lobbyPokemons: {
          connect: {
            id: player.teamPoke1.id,
          },
        },
      },
      include: {
        lobbyPokemons: true,
      },
    })

    if (updatedRoom.lobbyPokemons.length === raid.requiredPlayers) {
      const client = container.resolve<Client>('ZapClientInstance1')
      await client.sendMessage(
        data.groupCode,
        `${player.name} e ${player.teamPoke1.baseData.name} estão prontos para a próxima sala.
      A batalha era iniciar.`
      )
      return await raidProgress(data)
    }

    return {
      message: `${player.name} e ${player.teamPoke1.baseData.name} estão prontos para a próxima sala.`,
      status: 200,
    }
  }

  const imageUrl = await iGenRaidNextRoom({
    enemyPokemons: currentRoom.enemyPokemons,
    raid,
  })

  return {
    message: `${raid.name.toUpperCase()} - ${raid.difficulty} - ${raid.currentRoomIndex}/${raid.raidRooms.length}
    👍 - Pronto para próxima sala`,
    status: 200,
    imageUrl,
    actions: [`pz. raid select ${raid.id} ${roomId} confirm`],
  }
}
