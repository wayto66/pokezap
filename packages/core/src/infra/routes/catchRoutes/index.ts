import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import {
  CatchFailedPokemonRanAwayError,
  InvalidPokeBallName,
  MissingParametersCatchRouteError,
  PlayerDidNotDefeatPokemonError,
  PlayerDoesNotHaveItemError,
  PlayerNotFoundError,
  PokemonAlreadyHasOwnerError,
  PokemonNotFoundError,
} from '../../errors/AppErrors'
import { logger } from '../../logger'
import { TRouteParams } from '../router'

const ballNameMap = new Map<string, string>([
  // POKE-BALL
  ['POKEBALL', 'poke-ball'],
  ['POKE-BALL', 'poke-ball'],
  ['POKEBOLA', 'poke-ball'],
  ['POKE-BOLA', 'poke-ball'],

  // GREAT-BALL
  ['GREATBALL', 'great-ball'],
  ['GREAT-BALL', 'great-ball'],
  ['GREATBOLA', 'great-ball'],
  ['GREAT-BOLA', 'great-ball'],

  // ULTRA-BALL
  ['ULTRABALL', 'ultra-ball'],
  ['ULTRA-BALL', 'ultra-ball'],
  ['ULTRABOLA', 'ultra-ball'],
  ['ULTRA-BOLA', 'ultra-ball'],

  // SPECIAL-BALL
  ['SORABALL', 'sora-ball'],
  ['SORA-BALL', 'sora-ball'],
  ['MAGUBALL', 'magu-ball'],
  ['MAGU-BALL', 'magu-ball'],
  ['TALEBALL', 'tale-ball'],
  ['TALE-BALL', 'tale-ball'],
  ['JANGURUBALL', 'janguru-ball'],
  ['JANGURU-BALL', 'janguru-ball'],
  ['MOONBALL', 'moon-ball'],
  ['MOON-BALL', 'moon-ball'],
  ['TINKERBALL', 'tinker-ball'],
  ['TINKER-BALL', 'tinker-ball'],
  ['YUMEBALL', 'yume-ball'],
  ['YUME-BALL', 'yume-ball'],
  ['DUSKBALL', 'dusk-ball'],
  ['DUSK-BALL', 'dusk-ball'],
  ['NETBALL', 'net-ball'],
  ['NET-BALL', 'net-ball'],
  ['BEASTBALL', 'beast-ball'],
  ['BEAST-BALL', 'beast-ball'],
  ['MASTERBALL', 'master-ball'],
  ['MASTER-BALL', 'master-ball'],
])

export const catchRoutes = async (data: TRouteParams): Promise<IResponse> => {
  const [, , givenBallName, givenId] = data.routeParams
  const pokemonId = Number(givenId)
  if (!pokemonId || isNaN(pokemonId) || !givenBallName) throw new MissingParametersCatchRouteError()

  const ballName = ballNameMap.get(givenBallName)
  if (!ballName) throw new InvalidPokeBallName(givenBallName)

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemon = await prisma.pokemon.findFirst({
    where: {
      id: pokemonId,
    },
    include: {
      baseData: true,
      defeatedBy: true,
      ranAwayFrom: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonId)
  if (!pokemon.savage || pokemon.ownerId) throw new PokemonAlreadyHasOwnerError(pokemonId, data.playerName)
  if (!pokemon.defeatedBy.map(player => player.id).includes(player.id))
    throw new PlayerDidNotDefeatPokemonError(player.name)
  if (pokemon.ranAwayFrom.map(player => player.id).includes(player.id))
    throw new CatchFailedPokemonRanAwayError(pokemon.id, player.name)

  const pokeball = await prisma.item.findFirst({
    where: {
      ownerId: player.id,
      baseItem: {
        name: ballName,
      },
    },
    include: {
      baseItem: true,
    },
  })
  if (!pokeball || pokeball.amount <= 0) throw new PlayerDoesNotHaveItemError(data.playerName, ballName)

  await prisma.item.updateMany({
    where: {
      id: pokeball.id,
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  })

  function calculateCatchRate(baseExp: number): number {
    const x = (baseExp + 10) / 304 // scale baseExp from 36-340 to 0-1
    const catchRate = 1 - Math.exp(-3 * x)
    return Math.min(1 - catchRate)
  }

  const getBallRateMultiplier = () => {
    if (ballName === 'poke-ball') return 0.65
    if (ballName === 'great-ball') return 1.1
    if (ballName === 'ultra-ball') return 2.2
    if (ballName === 'sora-ball') {
      if (
        ['ice', 'flying'].includes(pokemon.baseData.type1Name) ||
        ['ice', 'flying'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'magu-ball') {
      if (
        ['fire', 'earth'].includes(pokemon.baseData.type1Name) ||
        ['fire', 'earth'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'tale-ball') {
      if (
        ['fairy', 'dragon'].includes(pokemon.baseData.type1Name) ||
        ['fairy', 'dragon'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'janguru-ball') {
      if (
        ['grass', 'poison'].includes(pokemon.baseData.type1Name) ||
        ['grass', 'poison'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'tinker-ball') {
      if (
        ['electric', 'steel'].includes(pokemon.baseData.type1Name) ||
        ['electric', 'steel'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'yume-ball') {
      if (
        ['psychic', 'normal'].includes(pokemon.baseData.type1Name) ||
        ['psychic', 'normal'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'moon-ball') {
      if (
        ['dark', 'ghost'].includes(pokemon.baseData.type1Name) ||
        ['dark', 'ghost'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'dusk-ball') {
      if (
        ['fighting', 'rock'].includes(pokemon.baseData.type1Name) ||
        ['fighting', 'rock'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'net-ball') {
      if (
        ['bug', 'water'].includes(pokemon.baseData.type1Name) ||
        ['bug', 'water'].includes(pokemon.baseData.type2Name || '')
      )
        return 10
      return 0.4
    }
    if (ballName === 'beast-ball') return 40
    if (ballName === 'master-ball') return 9999999

    return 0.4
  }

  const shinyMultiplier = pokemon.isShiny ? 0.02 : 1
  const regionalMultiplier = pokemon.baseData.isRegional ? 0.7 : 1

  const catchRate =
    calculateCatchRate(pokemon.isShiny ? 170 : pokemon.baseData.BaseExperience) *
    getBallRateMultiplier() *
    shinyMultiplier *
    regionalMultiplier
  const random = Math.random()

  logger.info(
    `${player.name} ${catchRate > random ? 'catches' : 'fails to catch'} #${pokemon.id} ${
      pokemon.isShiny ? 'SHINY' : ''
    } ${pokemon.baseData.name}. BALL: ${ballName}, CHANCE: ${catchRate}`
  )

  if (catchRate > random) {
    await prisma.pokemon.updateMany({
      where: {
        id: pokemon.id,
      },
      data: {
        savage: false,
        ownerId: player.id,
      },
    })

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        caughtDbIds: {
          push: pokemon.id,
        },
        caughtDexIds: {
          push: pokemon.baseData.pokedexId,
        },
      },
    })

    return {
      message: `${pokemon.baseData.name.toUpperCase()} foi capturado por ${data.playerName}!`,
      status: 200,
      data: null,
    }
  }

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
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
    message: `Sinto muito ${data.playerName}, sua ${ballName} quebrou. Restam ${pokeball.amount - 1} ${ballName}.`,
    status: 200,
    data: null,
  }
}
