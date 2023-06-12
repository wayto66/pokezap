import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'
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
  if (player.energy < 2) throw new NoEnergyError(player.name)

  const playerPokemon = await prismaClient.pokemon.findFirst({
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

  const raid = await prismaClient.raid.findFirst({
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

  const updatedRaid = await prismaClient.raid.update({
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

  await prismaClient.player.update({
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
    await prismaClient
      .$transaction(
        raid.lobbyPokemons.map(poke =>
          prismaClient.player.update({
            where: {
              id: poke.ownerId ?? 0,
            },
            data: {
              isInRaid: true,
              energy: {
                decrement: 2,
              },
            },
          })
        )
      )
      .catch(e => console.log(e))
    const zapClient = container.resolve<Client>('ZapClientInstance1')
    await zapClient.sendMessage(
      data.groupCode,
      `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de raid!
      A aventura vai iniciar!`
    )
    await prismaClient.raid.update({
      where: {
        id: raid.id,
      },
      data: {
        inInLobby: false,
        isInProgress: true,
      },
    })

    await prismaClient.player.updateMany({
      where: {
        id: {
          in: raid.lobbyPokemons.map(p => p.ownerId || 0),
        },
      },
      data: {
        energy: {
          decrement: 2,
        },
      },
    })

    return await raidRoomSelect({
      ...data,
      routeParams: ['PZ.', 'RAID', 'SELECT', raid.id.toString(), raid.currentRoomIndex.toString()],
    })
  }

  return {
    message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de raid!`,
    status: 200,
    data: null,
  }
}
