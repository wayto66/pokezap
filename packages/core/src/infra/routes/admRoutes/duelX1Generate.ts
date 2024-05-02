import { iGenDuelX2 } from '../../../../../image-generator/src/iGenDuelX2'
import { IResponse } from '../../../server/models/IResponse'
import {
  CantDuelItselfError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  TypeMissmatchError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

const include = {
  teamPoke1: {
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  },
  teamPoke2: {
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  },
  teamPoke3: {
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  },
  teamPoke4: {
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  },
  teamPoke5: {
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  },
  teamPoke6: {
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
    },
  },
}

export const duelX1Generate = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , player1IdString, player2IdString] = data.routeParams
  const player1Id = Number(player1IdString)
  const player2Id = Number(player2IdString)
  if (typeof player1Id !== 'number') throw new TypeMissmatchError(player1IdString, 'NÚMERO')
  if (typeof player2Id !== 'number') throw new TypeMissmatchError(player2IdString, 'NÚMERO')

  const player1 = await prisma.player.findUnique({
    where: {
      id: player1Id,
    },
    include,
  })
  if (!player1) throw new PlayerNotFoundError(data.playerPhone)
  if (
    !player1.teamPoke1 ||
    !player1.teamPoke2 ||
    !player1.teamPoke3 ||
    !player1.teamPoke4 ||
    !player1.teamPoke5 ||
    !player1.teamPoke6
  )
    throw new PlayerDoesNotHaveThePokemonInTheTeamError(player1.name)
  if (player1.id === player2Id) throw new CantDuelItselfError()

  const player2 = await prisma.player.findUnique({
    where: {
      id: player2Id,
    },
    include,
  })
  if (!player2) throw new PlayerNotFoundError(player2IdString)
  if (
    !player1.teamPoke1 ||
    !player1.teamPoke2 ||
    !player1.teamPoke3 ||
    !player1.teamPoke4 ||
    !player1.teamPoke5 ||
    !player1.teamPoke6
  )
    throw new PlayerDoesNotHaveThePokemonInTheTeamError(player2.name)

  const newSession = await prisma.session.create({
    data: {
      mode: 'duel-x6',
      creatorId: player1.id,
      invitedId: player2.id,
    },
  })

  const imageUrl = await iGenDuelX2({
    player1: player1,
    player2: player2,
  })

  return {
    message: `Um novo duelo foi gerado!
    
    *#${player1.id} ${player1.name}* contra *#${player2.id} ${player2.name}*!

    👍 - Aceitar`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [
      `pz. duel generated-accept ${newSession.id}`,
      `pz. duel generated-accept ${newSession.id}`,
      `pz. duel generated-accept ${newSession.id}`,
    ],
  }
}
