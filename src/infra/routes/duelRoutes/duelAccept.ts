import { BasePokemon, Player, Pokemon, PrismaClient, Skill } from '@prisma/client'
import { container } from 'tsyringe'
import {
  CouldNotUpdatePlayerError,
  NoDuelLoserFoundError,
  NoDuelWinnerFoundError,
  NoEnergyError,
  PlayerDoesNotHaveThePokemonInTheTeamError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  SendEmptyMessageError,
  SessionIdNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../infra/errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { duelX1 } from '../../../server/modules/duel/duelX1'
import { TRouteParams } from '../router'
import { handleExperienceGain } from '../../../server/modules/pokemon/handleExperienceGain'
import { duelX2 } from '../../../server/modules/duel/duelX2'

export type DuelPokemon = Pokemon & {
  baseData: BasePokemon & {
    skills: Skill[]
  }
}

export type DuelPlayer = Player & {
  teamPoke1: DuelPokemon | null
}

export const duelAccept = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , sessionIdString] = data.routeParams
  const sessionId = Number(sessionIdString)
  if (typeof sessionId !== 'number') throw new TypeMissmatchError(sessionIdString, 'number')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player2 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player2) throw new PlayerNotFoundError(data.playerPhone)
  if (player2.energy <= 0) throw new NoEnergyError(player2.name)

  const session = await prismaClient.session.findFirst({
    where: {
      id: sessionId,
    },
    include: {
      creator: {
        include: {
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
        },
      },
      invited: {
        include: {
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
        },
      },
    },
  })
  if (!session || session.isFinished) throw new SessionIdNotFoundError(sessionId)
  if (!session.creator.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name)
  if (!session.invited.teamPoke1) throw new PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name)
  if (session.invitedId !== player2.id) throw new SendEmptyMessageError()
  console.log('starting duelx1')

  const duel = await duelX1({
    poke1: session.creator.teamPoke1,
    poke2: session.invited.teamPoke1,
  })

  console.log('after duelX1')

  if (!duel || !duel.imageUrl) throw new UnexpectedError('duelo')

  if (!duel.winner) throw new NoDuelWinnerFoundError()
  if (!duel.loser) throw new NoDuelLoserFoundError()

  const winnerId = duel.winner.ownerId
  const loserId = duel.loser.ownerId

  if (!winnerId) throw new UnexpectedError('duelo')
  if (!loserId) throw new UnexpectedError('duelo')

  if (isNaN(winnerId)) throw new TypeMissmatchError(winnerId, 'number')
  if (isNaN(loserId)) throw new TypeMissmatchError(loserId, 'number')

  const players = new Map<number, DuelPlayer>([
    [session.creator.id, session.creator],
    [session.invited.id, session.invited],
  ])
  const winner = players.get(winnerId)
  const loser = players.get(loserId)

  if (!winner) throw new PlayerNotFoundError(winnerId.toString())
  if (!loser) throw new PlayerNotFoundError(loserId.toString())

  const higherElo = Math.max(loser.elo, winner.elo)
  const lowerElo = Math.min(loser.elo, winner.elo)

  const getRewardsData = () => {
    const highEloGain = Math.max(10, Number((25 + (higherElo / 1200 - lowerElo / 1200) * 50).toFixed(2)))
    const lowEloGain = Math.max(10, Number((25 + (lowerElo / 1200 - higherElo / 1200) * 50).toFixed(2)))
    const highCashGain = Math.max(10, Number((100 + (higherElo / 1200 - lowerElo / 1200) * 70).toFixed(2)))
    const lowCashGain = Math.max(10, Number((100 + (lowerElo / 1200 - higherElo / 1200) * 70).toFixed(2)))
    const loseRatio = -1

    return {
      highEloGain,
      lowEloGain,
      highCashGain,
      lowCashGain,
      loseRatio,
    }
  }

  const rewardsData = getRewardsData()
  const eloLose = loser.elo === lowerElo ? rewardsData.lowEloGain : rewardsData.highEloGain
  const eloGain = winner.elo === lowerElo ? rewardsData.highEloGain : rewardsData.lowEloGain
  const cashGain = winner.elo === lowerElo ? rewardsData.highCashGain : rewardsData.lowCashGain

  const updatedWinnerPlayer = await prismaClient.player
    .update({
      where: {
        id: winner.id,
      },
      data: {
        energy: {
          decrement: 1,
        },
        elo: {
          increment: Math.round(eloGain),
        },
        cash: {
          increment: Math.round(cashGain),
        },
      },
    })
    .catch(e => console.log(e))

  const updatedLoserPlayer = await prismaClient.player
    .update({
      where: {
        id: loser.id,
      },
      data: {
        energy: {
          decrement: 1,
        },
        elo: {
          decrement: Math.round(eloLose),
        },
      },
    })
    .catch(e => console.log(e))

  if (!updatedLoserPlayer) throw new CouldNotUpdatePlayerError('id', loser.id)
  if (!updatedWinnerPlayer) throw new CouldNotUpdatePlayerError('id', winner.id)

  if (!winner.teamPoke1) throw new UnexpectedError('NOTEAMPOKE1')
  if (!loser.teamPoke1) throw new UnexpectedError('NOTEAMPOKE1')

  const pokemons = new Map<number, DuelPokemon>([
    [winner.teamPoke1.id, winner.teamPoke1],
    [loser.teamPoke1.id, loser.teamPoke1],
  ])

  const loserPokemon = pokemons.get(duel.loser.id)
  const winnerPokemon = pokemons.get(duel.winner.id)

  if (!loserPokemon) throw new PokemonNotFoundError(duel.loser.id)
  if (!winnerPokemon) throw new PokemonNotFoundError(duel.winner.id)

  const handleLoseExp = await handleExperienceGain({
    pokemon: loserPokemon,
    targetPokemon: winnerPokemon,
  })
  const handleWinExp = await handleExperienceGain({
    pokemon: winnerPokemon,
    targetPokemon: loserPokemon,
  })

  const winnerLevelUpMessage = handleWinExp.leveledUp
    ? `*${winnerPokemon.baseData.name}* subiu para o nível ${handleWinExp.pokemon.level}!`
    : ''
  const loserLevelUpMessage = handleLoseExp.leveledUp
    ? `*${loserPokemon.baseData.name}* subiu para o nível ${handleLoseExp.pokemon.level}!`
    : ''

  const afterMessage = `*${updatedWinnerPlayer.name}* vence o duelo e recebe +${eloGain} pontos de ranking e +${cashGain} POKECOINS.
*${updatedLoserPlayer.name}* perdeu ${eloLose} pontos de ranking.
${winnerLevelUpMessage}
${loserLevelUpMessage}`

  console.log('returning duelaceppt response')

  return {
    message: `${session.creator.name} e seu ${session.creator.teamPoke1.baseData.name} enfrenta o ${session.invited.teamPoke1.baseData.name} de ${session.invited.name}.`,
    status: 200,
    data: null,
    imageUrl: duel.imageUrl,
    afterMessage,
    isAnimated: true,
  }
}
