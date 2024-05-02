import prisma from '../../../../../prisma-provider/src'
import { MissingParameterError, PlayerNotFoundError } from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'

export const teamSave = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , teamNameUppercase] = data.routeParams

  if (!teamNameUppercase) throw new MissingParameterError('Nome do time')

  const teamName = teamNameUppercase.toLowerCase()

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
      teamPoke2: {
        include: {
          baseData: true,
        },
      },
      teamPoke3: {
        include: {
          baseData: true,
        },
      },
      teamPoke4: {
        include: {
          baseData: true,
        },
      },
      teamPoke5: {
        include: {
          baseData: true,
        },
      },
      teamPoke6: {
        include: {
          baseData: true,
        },
      },
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerName)

  const currentTeamIds = [
    player.teamPokeId1,
    player.teamPokeId2,
    player.teamPokeId3,
    player.teamPokeId4,
    player.teamPokeId5,
    player.teamPokeId6,
  ].filter(value => value !== null) as number[]

  const team = await prisma.pokeTeam.upsert({
    where: {
      name_ownerId: {
        name: teamName,
        ownerId: player.id,
      },
    },
    update: {
      pokeIds: currentTeamIds,
      slot1Id: currentTeamIds[0],
      slot2Id: currentTeamIds[1],
      slot3Id: currentTeamIds[2],
      slot4Id: currentTeamIds[3],
      slot5Id: currentTeamIds[4],
      slot6Id: currentTeamIds[5],
    },
    create: {
      ownerId: player.id,
      name: teamName,
      slot1Id: currentTeamIds[0],
      slot2Id: currentTeamIds[1],
      slot3Id: currentTeamIds[2],
      slot4Id: currentTeamIds[3],
      slot5Id: currentTeamIds[4],
      slot6Id: currentTeamIds[5],
    },
  })

  return {
    message: '',
    react: '👌',
    status: 200,
  }
}
