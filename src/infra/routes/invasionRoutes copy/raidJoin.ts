import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  InvasionAlreadyFinishedError,
  InvasionNotFoundError,
  MissingParametersBattleRouteError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  SendEmptyMessageError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { Client } from 'whatsapp-web.js'
import { raidProgress } from './raidProgress'

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
  })

  if (!raid) throw new InvasionNotFoundError(raidIdString)
  if (raid.isFinished) throw new InvasionAlreadyFinishedError()
  if (raid.isInProgress) throw new SendEmptyMessageError()

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

  if (updatedRaid.lobbyPokemons.length === raid.requiredPlayers) {
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

    return await raidProgress(data)
  }

  return {
    message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!`,
    status: 200,
    data: null,
  }
}
