import { PrismaClient } from '@prisma/client'
import {
  InsufficientLevelToEvolveError,
  PlayerDoesNotHaveItemError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonAlreadyOnLastEvolution,
  PokemonNotFoundError,
  UnexpectedError,
  UnknownEvolutionMethodError,
} from '../../../infra/errors/AppErrors'
import { container } from 'tsyringe'
import { generateHpStat } from './generateHpStat'
import { generateGeneralStats } from './generateGeneralStats'

type TParams = {
  pokemonId: number
  playerId: number
  fromTrade?: boolean
}

export const checkEvolutionPermition = async (
  data: TParams
): Promise<{
  message: string
  status: string
}> => {
  const client = container.resolve<PrismaClient>('PrismaClient')

  const poke = await client.pokemon.findFirst({
    where: {
      id: data.pokemonId,
      ownerId: data.playerId,
    },
    include: {
      baseData: true,
    },
  })

  const player = await client.player.findFirst({
    where: {
      id: data.playerId,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerId.toString())
  if (!poke) throw new PokemonNotFoundError(data.pokemonId)
  if (poke.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(poke.id, player.name)

  const fullData: any = poke.baseData.evolutionData
  const evData = fullData.evolutionChain[0]

  if (!evData)
    return {
      message: '',
      status: 'no-evdata',
    }

  const getCurrentPosition = () => {
    if (poke.baseData.isFirstEvolution) return 0
    if (poke.baseData.name === evData?.species?.name) return 1
    if (poke.baseData.name === evData?.evolves_to[0]?.species?.name) return 2

    return -1
  }

  const currentPosition = getCurrentPosition()

  if (currentPosition === 2) throw new PokemonAlreadyOnLastEvolution(poke.id, poke.baseData.name)

  if (currentPosition === -1)
    throw new UnexpectedError('Não foi possível localizar a posição do pokemon na cadeia evolutiva.')

  let evoData: any = null

  if (currentPosition === 0) evoData = evData
  if (currentPosition === 1) evoData = evData.evolves_to[0]

  if (evoData === null) {
    return {
      message: '',
      status: 'evodata-null',
    }
  }

  const evoTrigger = evoData?.evolution_details[0]?.trigger

  if (!evoTrigger) throw new PokemonAlreadyOnLastEvolution(poke.id, poke.baseData.name)
  if (evoTrigger.name !== 'level-up' && evoTrigger.name !== 'use-item' && evoTrigger.name !== 'trade') {
    return {
      message: 'Infelizmente o modo de evolução do seu Pokemon ainda não foi implementado.',
      status: 'evo-trigger-unsupported',
    }
  }

  if (evoTrigger.name === 'trade' && !data.fromTrade) throw new UnknownEvolutionMethodError(poke.id, poke.baseData.name)

  if (evoTrigger.name === 'level-up' && poke.level < (evoData.evolution_details[0].min_level || 15))
    throw new InsufficientLevelToEvolveError(poke.id, poke.baseData.name, evoData.evolution_details[0].min_level || 15)

  if (evoTrigger.name === 'use-item') {
    const requiredItemName = evoData.evolution_details[0].item.name
    if (!requiredItemName) throw new UnexpectedError('Não foi possível obter o nome do item requirido para evolução.')
    const requiredItem = await client.item.findFirst({
      where: {
        ownerId: poke.ownerId,
        baseItem: {
          name: requiredItemName,
        },
      },
    })

    if (!requiredItem || requiredItem.amount <= 0) throw new PlayerDoesNotHaveItemError(player.name, requiredItemName)

    await client.item.update({
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

  const evoToPoke = await client.basePokemon.findFirst({
    where: {
      name: evoData.species.name,
    },
  })

  if (!evoToPoke) throw new UnexpectedError('Não foi possível encontrar basePokemon: ' + evoData.species.name)

  const evolvedPoke = poke.isShiny
    ? await client.pokemon.update({
        where: {
          id: data.pokemonId,
        },
        data: {
          baseData: {
            connect: {
              id: evoToPoke.id,
            },
          },
          spriteUrl: evoToPoke.shinySpriteUrl,
          hp: Math.round(generateHpStat(evoToPoke.BaseHp, poke.level) * 1.1),
          atk: Math.round(generateGeneralStats(evoToPoke.BaseAtk, poke.level) * 1.1),
          def: Math.round(generateGeneralStats(evoToPoke.BaseDef, poke.level) * 1.1),
          spAtk: Math.round(generateGeneralStats(evoToPoke.BaseSpAtk, poke.level) * 1.1),
          spDef: Math.round(generateGeneralStats(evoToPoke.BaseSpDef, poke.level) * 1.1),
          speed: Math.round(generateGeneralStats(evoToPoke.BaseSpeed, poke.level) * 1.1),
        },
        include: {
          baseData: true,
        },
      })
    : await client.pokemon.update({
        where: {
          id: data.pokemonId,
        },
        data: {
          baseData: {
            connect: {
              id: evoToPoke.id,
            },
          },
          spriteUrl: evoToPoke.defaultSpriteUrl,
          hp: generateHpStat(evoToPoke.BaseHp, poke.level),
          atk: generateGeneralStats(evoToPoke.BaseAtk, poke.level),
          def: generateGeneralStats(evoToPoke.BaseDef, poke.level),
          spAtk: generateGeneralStats(evoToPoke.BaseSpAtk, poke.level),
          spDef: generateGeneralStats(evoToPoke.BaseSpDef, poke.level),
          speed: generateGeneralStats(evoToPoke.BaseSpeed, poke.level),
        },
        include: {
          baseData: true,
        },
      })

  return {
    message: `${poke.baseData.name} evoluiu para ${evolvedPoke.baseData.name}!`,
    status: 'evolved',
  }
}
