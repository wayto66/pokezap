import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'
import { IResponse } from '../../../server/models/IResponse'
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
import { TRouteParams } from '../router'
import { battleInvasionX2 } from './invasionDefend/battleInvasionX2'
import { bossInvasion } from './invasionDefend/bossInvasion'

export const invasionDefendLobbyRoute = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , invasionSessionIdString] = data.routeParams
  if (!invasionSessionIdString) throw new MissingParametersBattleRouteError()

  const invasionSessionId = Number(invasionSessionIdString)
  if (isNaN(invasionSessionId)) throw new TypeMissmatchError(invasionSessionIdString, 'número')

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

  const invasionSession = await prismaClient.invasionSession.findFirst({
    where: {
      id: invasionSessionId,
    },
  })

  if (!invasionSession) throw new InvasionNotFoundError(invasionSessionIdString)
  if (invasionSession.isFinished) throw new InvasionAlreadyFinishedError()
  if (invasionSession.isInProgress) throw new SendEmptyMessageError()

  const updatedInvasionSession = await prismaClient.invasionSession.update({
    where: {
      id: invasionSession.id,
    },
    data: {
      lobbyPlayers: {
        connect: {
          id: player.id,
        },
      },
    },
    include: {
      lobbyPlayers: true,
    },
  })

  if (updatedInvasionSession.lobbyPlayers.length === invasionSession.requiredPlayers) {
    const zapClient = container.resolve<Client>('ZapClientInstance1')
    await zapClient.sendMessage(
      data.groupCode,
      `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!
      A batalha vai iniciar!`
    )
    if (updatedInvasionSession.mode === 'boss-invasion')
      return await bossInvasion({ ...data, routeParams: ['', '', '', updatedInvasionSession.id.toString()] })
    return await battleInvasionX2({ ...data, routeParams: ['', '', '', updatedInvasionSession.id.toString()] })
  }

  return {
    message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!`,
    status: 200,
    data: null,
  }
}
