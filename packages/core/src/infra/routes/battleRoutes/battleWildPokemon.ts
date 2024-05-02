import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { duelNXN } from '../../../server/modules/duel/duelNXN'
import { handleExperienceGain } from '../../../server/modules/pokemon/handleExperienceGain'
import { handleRouteExperienceGain } from '../../../server/modules/route/handleRouteExperienceGain'
import {
  CouldNotUpdatePlayerError,
  MissingParametersBattleRouteError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerDoesNotResideOnTheRoute,
  PlayerNotFoundError,
  PokemonAlreadyBattledByPlayerError,
  PokemonAlreadyHasOwnerError,
  PokemonAlreadyRanAwayError,
  PokemonNotFoundError,
  RouteNotFoundError,
  SendEmptyMessageError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { logger } from '../../logger'
import { TRouteParams } from '../router'

export const battleWildPokemon = async (data: TRouteParams): Promise<IResponse> => {
  const [, , wildPokemonIdString, fast] = data.routeParams
  if (!data.fromReact) throw new SendEmptyMessageError()
  if (!wildPokemonIdString) throw new MissingParametersBattleRouteError()

  const wildPokemonId = Number(wildPokemonIdString)
  if (isNaN(wildPokemonId)) throw new TypeMissmatchError(wildPokemonIdString, 'número')

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
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  if (!playerPokemon) throw new PokemonNotFoundError(player.teamPoke1.id)

  const wildPokemon = await prisma.pokemon.findFirst({
    where: {
      id: wildPokemonId,
    },
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
      ranAwayFrom: true,
      battledBy: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!wildPokemon || !wildPokemon.gameRoomId) throw new PokemonNotFoundError(wildPokemonId)
  if (wildPokemon.savage === false || wildPokemon.ownerId)
    throw new PokemonAlreadyHasOwnerError(wildPokemonId, wildPokemon.baseData.name)

  if (wildPokemon.ranAwayFrom.map(player => player.id).includes(player.id))
    throw new PokemonAlreadyRanAwayError(wildPokemon.id, player.name)

  if (wildPokemon.battledBy.map(player => player.id).includes(player.id))
    throw new PokemonAlreadyBattledByPlayerError(wildPokemon.id, player.name)

  if (!player.gameRooms.map(gameRoom => gameRoom.id).includes(wildPokemon.gameRoomId))
    throw new PlayerDoesNotResideOnTheRoute(wildPokemon.gameRoomId, player.name)

  const route = await prisma.gameRoom.findFirst({
    where: {
      id: wildPokemon.gameRoomId,
    },
    include: {
      players: true,
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, `Rota: ${wildPokemon.gameRoomId}`)

  const staticImage = !!(fast && fast === 'FAST')

  await prisma.pokemon.update({
    where: {
      id: wildPokemon.id,
    },
    data: {
      battledBy: {
        connect: {
          id: player.id,
        },
      },
    },
  })

  logger.info('1')

  const duel = await duelNXN({
    leftTeam: [playerPokemon],
    rightTeam: [wildPokemon],
    wildBattle: true,
    staticImage,
  })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')

  if (!duel.winnerTeam) throw new NoDuelWinnerFoundError()
  if (!duel.loserTeam) throw new NoDuelLoserFoundError()

  const displayName = wildPokemon.isShiny ? `shiny ${wildPokemon.baseData.name}` : wildPokemon.baseData.name

  const cashGain = Math.round(
    40 + Math.random() * 16 + (((wildPokemon.baseData.BaseExperience / 340) * wildPokemon.level) / 20) * 220
  )

  if (duel.loserTeam[0].id === player.teamPoke1.id) {
    await prisma.pokemon.update({
      where: {
        id: wildPokemon.id,
      },
      data: {
        ranAwayFrom: {
          connect: {
            id: player.id,
          },
        },
      },
    })

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          decrement: cashGain,
        },
      },
    })
    if (fast && fast === 'FAST') {
      return {
        message: `*${player.name}* foi derrotado por ${wildPokemon.baseData.name} e perdeu ${cashGain} POKECOINS.`,
        status: 200,
        imageUrl: duel.imageUrl,
        actions: [
          `pz. catch pokeball ${wildPokemon.id}`,
          `pz. catch greatball ${wildPokemon.id}`,
          `pz. catch ultraball ${wildPokemon.id}`,
        ],
      }
    }

    logger.info('2')

    return {
      message: `*${player.name}* e seu *${playerPokemon.baseData.name}*
      enfrentam 
      ${displayName} level ${wildPokemon.level}.`,
      status: 200,
      actions: [`pz. catch pokeball ${wildPokemon.id}`],
      data: null,
      imageUrl: duel.imageUrl,
      afterMessage: `*${player.name}* foi derrotado por ${wildPokemon.baseData.name} e perdeu ${cashGain} POKECOINS.`,
      afterMessageActions: [`pz. catch pokeball ${wildPokemon.id}`],
      isAnimated: !staticImage,
    }
  }

  const updatedPlayer = await prisma.player.update({
    where: {
      id: player.id,
    },
    data: {
      cash: {
        increment: cashGain,
      },
    },
  })

  if (!updatedPlayer) throw new CouldNotUpdatePlayerError('id', player.id)

  const handleWinExp = await handleExperienceGain({
    pokemon: playerPokemon,
    targetPokemon: wildPokemon,
  })

  await handleRouteExperienceGain({
    route: route,
    pokemon: playerPokemon,
    targetPokemon: wildPokemon,
  })

  const winnerLevelUpMessage = handleWinExp.leveledUp
    ? `*${playerPokemon.baseData.name}* subiu para o nível ${handleWinExp.pokemon.level}!`
    : ''

  const afterMessage = `*${player.name}* vence* #${wildPokemon.id} - ${wildPokemon.baseData.name}* e recebe +${cashGain} POKECOINS.
${winnerLevelUpMessage}
👍 - Jogar poke-ball
❤ - Jogar great-ball
😂 - Jogar ultra-ball
`

  await prisma.pokemon.update({
    where: {
      id: wildPokemon.id,
    },
    data: {
      defeatedBy: {
        connect: {
          id: player.id,
        },
      },
    },
  })

  if (fast && fast === 'FAST') {
    return {
      message: afterMessage,
      status: 200,
      imageUrl: duel.imageUrl,
      actions: [
        `pz. catch pokeball ${wildPokemon.id}`,
        `pz. catch greatball ${wildPokemon.id}`,
        `pz. catch ultraball ${wildPokemon.id}`,
      ],
      isAnimated: false,
    }
  }

  return {
    message: `*${player.name}* e *${playerPokemon.baseData.name}* VS *${displayName}*!`,
    status: 200,
    imageUrl: duel.imageUrl,
    afterMessage,
    afterMessageActions: [
      `pz. catch pokeball ${wildPokemon.id}`,
      `pz. catch greatball ${wildPokemon.id}`,
      `pz. catch ultraball ${wildPokemon.id}`,
    ],
    isAnimated: !staticImage,
  }
}
