import prisma from '../../../../../prisma-provider/src'
import {
  InsufficientLevelToEvolveError,
  PlayerDoesNotHaveItemError,
  PlayerNotFoundError,
  PokemonDoesNotHaveOwnerError,
  UnexpectedError,
  UnknownEvolutionMethodError,
  WrongRegionToEvolveError,
} from '../../../infra/errors/AppErrors'
import { PokemonBaseData } from '../../../types'
import { BasePokemon } from '../../../types/prisma'

import { generateGeneralStats } from './generateGeneralStats'
import { generateHpStat } from './generateHpStat'

type TParams = {
  pokemon: PokemonBaseData
  fromTrade?: boolean
  currentRegion: string
}

export const handleAlolaGalarEvolution = async (
  data: TParams
): Promise<{
  evolved: boolean
  pokemon?: PokemonBaseData
  errorMessage?: string
}> => {
  const { pokemon, fromTrade } = data

  const player = await prisma.player.findFirst({
    where: {
      id: pokemon.ownerId || 0,
    },
  })

  if (!player) throw new PlayerNotFoundError((pokemon.ownerId || 0).toString())
  if (!pokemon.ownerId) throw new PokemonDoesNotHaveOwnerError(pokemon.id, pokemon.baseData.name)

  const evData = getRegionalEvolutionData(pokemon.baseData)

  if (evData?.evolveTo !== '' && evData?.evolveTo[0].split('-')[1] !== data.currentRegion)
    throw new WrongRegionToEvolveError(pokemon.baseData.name)

  if (!evData)
    return {
      evolved: false,
      errorMessage: 'no-evData',
    }

  if (evData.evolveTo === '')
    return {
      evolved: false,
      errorMessage: 'no-evolveTo',
    }

  if (evData.trigger.name === 'trade' && !fromTrade)
    throw new UnknownEvolutionMethodError(pokemon.id, pokemon.baseData.name)

  if (evData.trigger.name === 'level-up' && pokemon.level < Number(evData.trigger.requires))
    throw new InsufficientLevelToEvolveError(pokemon.id, pokemon.baseData.name, Number(evData.trigger.requires) || 15)

  if (evData.trigger.name === 'use-item' || (evData.trigger.name === 'trade' && evData.trigger.requires !== '')) {
    const requiredItemName = evData.trigger.requires
    if (!requiredItemName) throw new UnexpectedError('Não foi possível obter o nome do item requirido para evolução.')
    const requiredItem = await prisma.item.findFirst({
      where: {
        ownerId: pokemon.ownerId,
        baseItem: {
          name: requiredItemName.toString(),
        },
      },
    })

    if (!requiredItem || requiredItem.amount <= 0)
      throw new PlayerDoesNotHaveItemError(player.name, requiredItemName.toString())

    await prisma.item.update({
      where: {
        id: requiredItem.id,
      },
      data: {
        amount: {
          decrement: 1,
        },
      },
    })
  }

  const targetEvolution = evData.evolveTo[0]

  const evoToPoke = await prisma.basePokemon.findFirst({
    where: {
      name: targetEvolution,
    },
  })

  if (!evoToPoke) throw new UnexpectedError('Não foi possível encontrar a evolução com nome: ' + targetEvolution)

  const evolvedPoke = pokemon.isShiny
    ? await prisma.pokemon.update({
        where: {
          id: data.pokemon.id,
        },
        data: {
          baseData: {
            connect: {
              id: evoToPoke.id,
            },
          },
          spriteUrl: evoToPoke.shinySpriteUrl,
          hp: Math.round(generateHpStat(evoToPoke.BaseHp, pokemon.level) * 1.15),
          atk: Math.round(generateGeneralStats(evoToPoke.BaseAtk, pokemon.level) * 1.15),
          def: Math.round(generateGeneralStats(evoToPoke.BaseDef, pokemon.level) * 1.15),
          spAtk: Math.round(generateGeneralStats(evoToPoke.BaseSpAtk, pokemon.level) * 1.15),
          spDef: Math.round(generateGeneralStats(evoToPoke.BaseSpDef, pokemon.level) * 1.15),
          speed: Math.round(generateGeneralStats(evoToPoke.BaseSpeed, pokemon.level) * 1.15),
        },
        include: {
          baseData: true,
        },
      })
    : await prisma.pokemon.update({
        where: {
          id: data.pokemon.id,
        },
        data: {
          baseData: {
            connect: {
              id: evoToPoke.id,
            },
          },
          spriteUrl: evoToPoke.defaultSpriteUrl,
          hp: generateHpStat(evoToPoke.BaseHp, pokemon.level),
          atk: generateGeneralStats(evoToPoke.BaseAtk, pokemon.level),
          def: generateGeneralStats(evoToPoke.BaseDef, pokemon.level),
          spAtk: generateGeneralStats(evoToPoke.BaseSpAtk, pokemon.level),
          spDef: generateGeneralStats(evoToPoke.BaseSpDef, pokemon.level),
          speed: generateGeneralStats(evoToPoke.BaseSpeed, pokemon.level),
        },
        include: {
          baseData: true,
        },
      })

  return {
    pokemon: evolvedPoke,
    evolved: true,
  }
}

type TEvData = {
  trigger: {
    name: string
    requires: string | number
  }
  evolveTo: string | string[]
}

export const getRegionalEvolutionData = (baseData: BasePokemon) => {
  const regionPokemonCECPMap = new Map<string, TEvData>([
    [
      'vulpix-alola',
      {
        trigger: {
          name: 'use-item',
          requires: 'ice-stone',
        },
        evolveTo: ['ninetales-alola'],
      },
    ],
    [
      'ninetales-alola',
      {
        trigger: {
          name: 'use-item',
          requires: 'ice-stone',
        },
        evolveTo: '',
      },
    ],
    [
      'diglett-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 26,
        },
        evolveTo: ['dugtrio-alola'],
      },
    ],
    [
      'dugtrio-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 26,
        },
        evolveTo: '',
      },
    ],
    [
      'meowth-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 28,
        },
        evolveTo: ['persian-alola'],
      },
    ],
    [
      'geodude-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 25,
        },
        evolveTo: ['graveler-alola'],
      },
    ],
    [
      'graveler-alola',
      {
        trigger: {
          name: 'trade',
          requires: '',
        },
        evolveTo: ['golem-alola'],
      },
    ],
    [
      'graveler-alola',
      {
        trigger: {
          name: 'trade',
          requires: '',
        },
        evolveTo: '',
      },
    ],
    [
      'grimer-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 38,
        },
        evolveTo: ['muk-alola'],
      },
    ],
    [
      'muk-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 38,
        },
        evolveTo: '',
      },
    ],
    [
      'sandshrew-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 22,
        },
        evolveTo: ['sandslash-alola'],
      },
    ],
    [
      'sandslash-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 22,
        },
        evolveTo: '',
      },
    ],
    [
      'pikachu',
      {
        trigger: {
          name: 'use-item',
          requires: 'thunder-stone',
        },
        evolveTo: ['raichu-alola'],
      },
    ],
    [
      'raichu-alola',
      {
        trigger: {
          name: 'use-item',
          requires: 'thunder-stone',
        },
        evolveTo: '',
      },
    ],
    [
      'rattata-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 20,
        },
        evolveTo: ['raticate-alola'],
      },
    ],
    [
      'raticate-alola',
      {
        trigger: {
          name: 'level-up',
          requires: 20,
        },
        evolveTo: '',
      },
    ],
    [
      'cubone',
      {
        trigger: {
          name: 'level-up',
          requires: 28,
        },
        evolveTo: ['marowak-alola'],
      },
    ],
    [
      'exeggcute',
      {
        trigger: {
          name: 'use-item',
          requires: 'leaf-stone',
        },
        evolveTo: ['exeggutor-alola'],
      },
    ],
    [
      'exeggutor-alola',
      {
        trigger: {
          name: 'use-item',
          requires: 'leaf-stone',
        },
        evolveTo: '',
      },
    ],
    [
      'meowth-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 28,
        },
        evolveTo: ['persian-galar'],
      },
    ],
    [
      'ponyta-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 40,
        },
        evolveTo: ['rapidash-galar'],
      },
    ],
    [
      'rapidash-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 40,
        },
        evolveTo: '',
      },
    ],
    [
      'slowpoke-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'galarica-cuff',
        },
        evolveTo: ['slowbro-galar'],
      },
    ],
    [
      'koffing',
      {
        trigger: {
          name: 'level-up',
          requires: 35,
        },
        evolveTo: ['weezing-galar'],
      },
    ],
    [
      'weezing-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 35,
        },
        evolveTo: '',
      },
    ],
    [
      'mime-jr',
      {
        trigger: {
          name: 'level-up',
          requires: 32,
        },
        evolveTo: ['mr-mime-galar'],
      },
    ],
    [
      'mr-mime-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 32,
        },
        evolveTo: '',
      },
    ],
    [
      'articuno-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'crackling-ice',
        },
        evolveTo: 'articuno-galar',
      },
    ],
    [
      'zapdos-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'galarica-wreath',
        },
        evolveTo: 'zapdos-galar',
      },
    ],
    [
      'moltres-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'crackling-ice',
        },
        evolveTo: 'moltres-galar',
      },
    ],
    [
      'slowbro-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'galarica-wreath',
        },
        evolveTo: ['slowking-galar'],
      },
    ],
    [
      'slowking-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'galarica-wreath',
        },
        evolveTo: '',
      },
    ],
    /*     [
      'corsola-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 38,
        },
        evolveTo: 'cursola-galar',
      },
    ], */
    [
      'zigzagoon-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 20,
        },
        evolveTo: ['linoone-galar'],
      },
    ],
    [
      'linoone-galar',
      {
        trigger: {
          name: 'level-up',
          requires: 20,
        },
        evolveTo: '',
      },
    ],
    [
      'darumaka-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'ice-stone',
        },
        evolveTo: ['darmanitan-galar', 'darmanitan-galar-zen'],
      },
    ],
    [
      'darmanitan-galar',
      {
        trigger: {
          name: 'use-item',
          requires: 'ice-stone',
        },
        evolveTo: '',
      },
    ],
    [
      'darmanitan-galar-zen',
      {
        trigger: {
          name: 'use-item',
          requires: 'ice-stone',
        },
        evolveTo: '',
      },
    ],
  ])

  return regionPokemonCECPMap.get(baseData.name)
}
