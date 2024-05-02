import { iGenPokemonBreed } from '../../../../../image-generator/src'
import prisma from '../../../../../prisma-provider/src'
import {
  InsufficientFundsError,
  InsufficientShardsError,
  InvalidChildrenAmountError,
  MissingParametersBreedRouteError,
  PlayerNotFoundError,
  PlayersPokemonNotFoundError,
  PokemonAlreadyHasChildrenError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../infra/errors/AppErrors'
import { sendMessage } from '../../../server/helpers/sendMessage'
import { IPokemon } from '../../../server/models/IPokemon'
import { IResponse } from '../../../server/models/IResponse'
import { breed } from '../../../server/modules/pokemon/breed'
import { TRouteParams } from '../router'

export const pokemonBreed2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , pokemonId1String, pokemonId2String, desiredChildrenAmountString, confirm] = data.routeParams
  const desiredChildrenAmount = Number(desiredChildrenAmountString)
  if (!pokemonId1String || !pokemonId2String) throw new MissingParametersBreedRouteError()
  if (isNaN(desiredChildrenAmount) || desiredChildrenAmount > 4) throw new InvalidChildrenAmountError()

  const pokemonId1 = Number(pokemonId1String.slice(pokemonId1String.indexOf('#') + 1))
  if (isNaN(pokemonId1)) throw new TypeMissmatchError(pokemonId1String, 'number')

  const pokemonId2 = Number(pokemonId2String.slice(pokemonId2String.indexOf('#') + 1))
  if (isNaN(pokemonId2)) throw new TypeMissmatchError(pokemonId2String, 'number')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemon1 = await prisma.pokemon.findFirst({
    where: {
      id: pokemonId1,
      ownerId: player.id,
    },
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
    },
  })
  if (!pokemon1) throw new PlayersPokemonNotFoundError(pokemonId1, player.name)

  const pokemon2 = await prisma.pokemon.findFirst({
    where: {
      id: pokemonId2,
      ownerId: player.id,
    },
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
    },
  })
  if (!pokemon2) throw new PlayersPokemonNotFoundError(pokemonId2, player.name)

  const getChildrenCount = (poke: IPokemon): number => {
    if (!poke.childrenId1) return 0
    if (!poke.childrenId2) return 1
    if (!poke.childrenId3) return 2
    if (!poke.childrenId4) return 3
    return 4
  }

  const poke1ChildrenCount = getChildrenCount(pokemon1)
  if (desiredChildrenAmount > 4 - poke1ChildrenCount)
    throw new PokemonAlreadyHasChildrenError(pokemon1.id, pokemon1.baseData.name, poke1ChildrenCount)

  const poke2ChildrenCount = getChildrenCount(pokemon2)
  if (desiredChildrenAmount > 4 - poke2ChildrenCount)
    throw new PokemonAlreadyHasChildrenError(pokemon2.id, pokemon2.baseData.name, poke2ChildrenCount)

  const getBreedingCosts = (poke: any, childrenCount: number) => {
    let finalCost = 0
    let updatedChildrenCount = childrenCount + 1

    for (let i = 0; i < desiredChildrenAmount; i++) {
      finalCost += (220 + (poke.baseData.BaseExperience ** 2 / 231) * updatedChildrenCount ** 3.23) / 2.7
      updatedChildrenCount++
    }
    return finalCost
  }
  const totalCost = Math.round(
    getBreedingCosts(pokemon1, poke1ChildrenCount) + getBreedingCosts(pokemon2, poke2ChildrenCount)
  )

  const shardCost = Math.round(totalCost / 10)
  if (player.cash < totalCost) throw new InsufficientFundsError(player.name, player.cash, totalCost)
  if (player.pokeShards < shardCost) throw new InsufficientShardsError(player.name, player.pokeShards, shardCost)

  if (confirm === 'CONFIRM') {
    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          decrement: totalCost,
        },
        pokeShards: {
          decrement: shardCost,
        },
      },
    })

    let updatedPoke1ChildrenCount = poke1ChildrenCount
    let updatedPoke2ChildrenCount = poke2ChildrenCount

    for (let i = 0; i < desiredChildrenAmount; i++) {
      const newBaby = await breed({
        poke1: pokemon1,
        poke2: pokemon2,
      })

      if (typeof newBaby === 'string') {
        return {
          message: newBaby,
          status: 200,
          data: null,
        }
      }

      const updateChildrenData = (counter: number) => {
        if (counter === 0) {
          counter++
          return { childrenId1: newBaby.id }
        }
        if (counter === 1) {
          counter++
          return { childrenId2: newBaby.id }
        }
        if (counter === 2) {
          counter++
          return { childrenId3: newBaby.id }
        }
        if (counter === 3) {
          counter++
          return { childrenId4: newBaby.id }
        }
        throw new UnexpectedError('pokemonBreed2')
      }

      await prisma.pokemon.update({
        where: {
          id: pokemon1.id,
        },
        data: updateChildrenData(updatedPoke1ChildrenCount),
      })

      await prisma.pokemon.update({
        where: {
          id: pokemon2.id,
        },
        data: updateChildrenData(updatedPoke2ChildrenCount),
      })

      await sendMessage({
        chatId: data.groupCode,
        content: `#${newBaby.id} foi gerado por breed de #${pokemon1.id} ${pokemon1.baseData.name} e #${pokemon2.id} ${pokemon2.baseData.name}`,
      })

      updatedPoke1ChildrenCount++
      updatedPoke2ChildrenCount++
    }
    return {
      message: ``,
      react: '✔',
      status: 200,
      data: null,
    }
  }

  const imageUrl = await iGenPokemonBreed({
    pokemon1: pokemon1,
    pokemon2: pokemon2,
  })

  return {
    message: `Para realizar o breed de ${desiredChildrenAmount} filhotes, será necessário pagar ${totalCost} POKECOINS. 
    
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pokezap. breed ${pokemon1.id} ${pokemon2.id} ${desiredChildrenAmount} confirm`],
  }
}
