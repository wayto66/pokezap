import { iGenRaidNextRoom } from '../../../../../image-generator/src/iGenRaidNextRoom'
import prisma from '../../../../../prisma-provider/src'
import { sendMessage } from '../../../server/helpers/sendMessage'
import { IResponse } from '../../../server/models/IResponse'
import {
  MissingParameterError,
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

export const raidRoomSelect = async (data: TRouteParams): Promise<IResponse> => {
  const [, , selectType, raidIdString, roomIdString, confirm] = data.routeParams
  if (!data.fromReact) throw new UnexpectedError('Rota não permitida.')
  if (!raidIdString) throw new MissingParameterError('Id da raid')
  if (!roomIdString) throw new MissingParameterError('Id da sala da raid')

  const raidId = Number(raidIdString)
  if (isNaN(raidId)) throw new TypeMissmatchError(raidIdString, 'número')
  const roomId = Number(roomIdString)
  if (isNaN(roomId)) throw new TypeMissmatchError(roomIdString, 'número')

  const player = await prisma.player.findFirst({
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

  const raid = await prisma.raid.findFirst({
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
    const keyItems = await prisma.item.findMany({
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

    if (raid.defeatedPokemons.map(poke => poke.id).includes(player.teamPoke1.id)) {
      if (!revive || revive.amount <= 0)
        throw new PlayerDoesNotHaveReviveForPokemonInRaidError(player.name, player.teamPoke1.baseData.name)
      await prisma.item.update({
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

    await prisma.raid.update({
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

    const updatedRoom = await prisma.raidRoom.update({
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
      await sendMessage({
        chatId: data.groupCode,
        content: `${player.name} e ${
          player.teamPoke1.nickName ?? player.teamPoke1.baseData.name
        } estão prontos para a próxima sala.\nA batalha irá iniciar.`,
      })
      return await raidProgress(data)
    }

    return {
      message: `${player.name} e ${
        player.teamPoke1.nickName ?? player.teamPoke1.baseData.name
      } estão prontos para a próxima sala.`,
      status: 200,
    }
  }

  const imageUrl = await iGenRaidNextRoom({
    enemyPokemons: currentRoom.enemyPokemons,
    raid,
  })

  const currentRoomIndex = raid.raidRooms.findIndex(r => r.id === currentRoom.id)

  return {
    message: `${raid.name.toUpperCase()} - ${raid.difficulty}\nSALA: ${
      currentRoomIndex + 1
    }/4 \n\n👍 - Pronto para próxima sala`,
    status: 200,
    imageUrl,
    actions: [`pz. raid select ${raid.id} ${roomId} confirm`],
  }
}
