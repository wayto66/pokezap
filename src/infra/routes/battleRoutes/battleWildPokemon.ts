import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  CouldNotUpdatePlayerError,
  MissingParametersBattleRouteError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerDoesNotResideOnTheRoute,
  PlayerNotFoundError,
  PokemonAlreadyHasOwnerError,
  PokemonAlreadyRanAwayError,
  PokemonNotFoundError,
  RouteNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { duelX1 } from '../../../server/modules/duel/duelX1'
import { TRouteParams } from '../router'
import { handleExperienceGain } from '../../../server/modules/pokemon/handleExperienceGain'
import { handleRouteExperienceGain } from '../../../server/modules/route/handleRouteExperienceGain'

export const battleWildPokemon = async (data: TRouteParams): Promise<IResponse> => {
  const [, , wildPokemonIdString] = data.routeParams
  if (!wildPokemonIdString) throw new MissingParametersBattleRouteError()

  const wildPokemonId = Number(wildPokemonIdString)
  if (isNaN(wildPokemonId)) throw new TypeMissmatchError(wildPokemonIdString, 'número')

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

  const wildPokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: wildPokemonId,
    },
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
      ranAwayFrom: true,
    },
  })

  if (!wildPokemon || !wildPokemon.gameRoomId) throw new PokemonNotFoundError(wildPokemonId)
  if (wildPokemon.savage === false || wildPokemon.ownerId)
    throw new PokemonAlreadyHasOwnerError(wildPokemonId, wildPokemon.baseData.name)

  if (wildPokemon.ranAwayFrom.map(player => player.id).includes(player.id))
    throw new PokemonAlreadyRanAwayError(wildPokemon.id, player.name)

  if (!player.gameRooms.map(gameRoom => gameRoom.id).includes(wildPokemon.gameRoomId))
    throw new PlayerDoesNotResideOnTheRoute(wildPokemon.gameRoomId, player.name)

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      id: wildPokemon.gameRoomId,
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, `Rota: ${wildPokemon.gameRoomId}`)

  const duel = await duelX1({
    poke1: playerPokemon,
    poke2: wildPokemon,
    againstWildPokemon: true,
  })

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')

  if (!duel.winner) throw new NoDuelWinnerFoundError()
  if (!duel.loser) throw new NoDuelLoserFoundError()

  const displayName = wildPokemon.isShiny ? `shiny ${wildPokemon.baseData.name}` : wildPokemon.baseData.name

  if (duel.loser.id === player.teamPoke1.id) {
    await prismaClient.pokemon.update({
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
    return {
      message: `*${player.name}* e seu *${playerPokemon.baseData.name}*
      enfrentam 
      ${displayName} level ${wildPokemon.level}.`,
      status: 200,
      actions: [`pz. catch pokeball ${wildPokemon.id}`],
      data: null,
      imageUrl: duel.imageUrl,
      afterMessage: `*${player.name}* foi derrotado por ${wildPokemon.baseData.name}.`,
      afterMessageActions: [`pz. catch pokeball ${wildPokemon.id}`],
      isAnimated: true,
    }
  }

  const cashGain = Math.round(
    40 + Math.random() * 20 + (((wildPokemon.baseData.BaseExperience / 340) * wildPokemon.level) / 50) * 300
  )

  const updatedPlayer = await prismaClient.player.update({
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

  const afterMessage = `*${player.name}* vence o duelo e recebe +${cashGain} POKECOINS.
${winnerLevelUpMessage}

👍 - Jogar poke-ball
❤ - Jogar great-ball
😂 - Jogar ultra-ball

[Para outras pokeballs, utilize:
**. capturar nome-da-pokeball ${wildPokemon.id}]
`

  await prismaClient.pokemon.update({
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

  return {
    message: `*${player.name}* e seu *${playerPokemon.baseData.name}*
    enfrentam 
    ${displayName} level ${wildPokemon.level}.`,
    status: 200,
    actions: [
      `pz. catch pokeball ${wildPokemon.id}`,
      `pz. catch greatball ${wildPokemon.id}`,
      `pz. catch ultraball ${wildPokemon.id}`,
    ],
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    afterMessageActions: [`pz. catch pokeball ${wildPokemon.id}`],
    isAnimated: true,
  }
}
