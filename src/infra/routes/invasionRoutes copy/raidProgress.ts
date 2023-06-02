import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../server/models/IResponse'
import { duelNXN } from '../../../server/modules/duel/duelNXN'
import {
  InvasionAlreadyFinishedError,
  InvasionNotFoundError,
  MissingParametersBattleRouteError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const raidProgress = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , raidIdString] = data.routeParams
  if (!data.fromReact) throw new UnexpectedError('Rota não permitida.')
  if (!raidIdString) throw new MissingParametersBattleRouteError()

  const raidId = Number(raidIdString)
  if (isNaN(raidId)) throw new TypeMissmatchError(raidIdString, 'número')

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
        },
      },
    },
  })

  if (!raid) throw new InvasionNotFoundError(raidIdString)
  if (raid.isFinished) throw new InvasionAlreadyFinishedError()

  const currentTeamData =
    raid.currentRoomIndex === 0 ? raid.lobbyPokemons : raid.raidRooms[raid.currentRoomIndex - 1].winnerPokemons

  await duelNXN({
    playerTeam: currentTeamData,
    enemyTeam: raid.raidRooms[raid.currentRoomIndex].enemyPokemons,
  })

  // TODO: RAID
  // if (updatedRaid.lobbyPlayers.length === raid.requiredPlayers) {
  //   const zapClient = container.resolve<Client>('ZapClientInstance1')
  //   await zapClient.sendMessage(
  //     data.groupCode,
  //     `*${player.name}* e *${player.teamPoke1.baseData.name}* entraram para a equipe de raid!
  //     A aventura vai iniciar!`
  //   )
  //   if (updatedInvasionSession.mode === 'boss-invasion')
  //     return await bossInvasion({ ...data, routeParams: ['', '', '', updatedInvasionSession.id.toString()] })
  //   return await battleInvasionX2({ ...data, routeParams: ['', '', '', updatedInvasionSession.id.toString()] })
  // }

  return {
    // message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!`,
    message: `TO BE DEFINED`,
    status: 200,
    data: null,
  }
}
