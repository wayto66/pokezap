import prisma from '../../../../../prisma-provider/src'
import { sendMessage } from '../../../server/helpers/sendMessage'
import { IResponse } from '../../../server/models/IResponse'
import {
  InvasionNotFoundError,
  MissingParametersBattleRouteError,
  NoEnergyError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  RaidAlreadyFinishedError,
  RaidAlreadyInProgressError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'
import { raidRoomSelect } from './raidRoomSelect'

export const raidJoin = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , raidIdString] = data.routeParams
  if (!raidIdString) throw new MissingParametersBattleRouteError()

  const raidId = Number(raidIdString)
  if (isNaN(raidId)) throw new TypeMissmatchError(raidIdString, 'número')

  const player = await prisma.player.findFirst({
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
  if (player.energy < 1) throw new NoEnergyError(player.name)

  const playerPokemon = await prisma.pokemon.findFirst({
    where: {
      id: player.teamPoke1.id,
    },
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  })

  if (!playerPokemon) throw new PokemonNotFoundError(player.teamPoke1.id)

  const raid = await prisma.raid.findFirst({
    where: {
      id: raidId,
    },
    include: {
      lobbyPokemons: true,
    },
  })

  if (!raid) throw new InvasionNotFoundError(raidIdString)
  if (raid.isFinished) throw new RaidAlreadyFinishedError()
  if (raid.isInProgress) throw new RaidAlreadyInProgressError(player.name)

  const updatedRaid = await prisma.raid.update({
    where: {
      id: raid.id,
    },
    data: {
      lobbyPokemons: {
        connect: {
          id: playerPokemon.id,
        },
      },
    },
    include: {
      lobbyPokemons: true,
    },
  })

  await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      raidTeamIds: [
        player.teamPokeId1 || 0,
        player.teamPokeId2 || 0,
        player.teamPokeId3 || 0,
        player.teamPokeId4 || 0,
        player.teamPokeId5 || 0,
        player.teamPokeId6 || 0,
      ],
    },
  })

  if (updatedRaid.lobbyPokemons.length === raid.requiredPlayers) {
    await sendMessage({
      chatId: data.groupCode,
      content: `*${player.name}* e *${
        playerPokemon.nickName ?? playerPokemon.baseData.name
      }* entraram para a equipe de raid!
      A aventura vai iniciar!`,
    })
    await prisma.raid.update({
      where: {
        id: raid.id,
      },
      data: {
        inInLobby: false,
        isInProgress: true,
      },
    })

    await prisma.player.updateMany({
      where: {
        id: {
          in: raid.lobbyPokemons.map(p => p.ownerId || 0),
        },
      },
      data: {
        energy: {
          decrement: 1,
        },
      },
    })

    return await raidRoomSelect({
      ...data,
      routeParams: ['PZ.', 'RAID', 'SELECT', raid.id.toString(), raid.currentRoomIndex.toString()],
    })
  }

  return {
    message: `*${player.name}* e *${
      playerPokemon.nickName ?? playerPokemon.baseData.name
    }* entraram para a equipe de raid!`,
    status: 200,
    data: null,
  }
}
