import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import {
  InsufficientFundsError,
  InvalidChildrenAmountError,
  MissingParametersBreedRouteError,
  PlayerNotFoundError,
  PlayersPokemonNotFoundError,
  PokemonAlreadyHasChildrenError,
  TypeMissmatchError,
} from '../../../infra/errors/AppErrors'
import { IPokemon } from '../../../server/models/IPokemon'
import { IResponse } from '../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../server/modules/imageGen/iGenPokemonAnalysis'
import { iGenPokemonBreed } from '../../../server/modules/imageGen/iGenPokemonBreed'
import { breed } from '../../../server/modules/pokemon/breed'
import { TRouteParams } from '../router'

export const pokemonBreed2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , id1, id2, amount, confirm] = data.routeParams
  if (!id1 || !id2) throw new MissingParametersBreedRouteError()
  if (typeof Number(amount) !== 'number' || Number(amount) > 4) throw new InvalidChildrenAmountError()

  const idFix1 = Number(id1.slice(id1.indexOf('#') + 1))
  if (typeof idFix1 !== 'number') throw new TypeMissmatchError(id1, 'number')

  const idFix2 = Number(id2.slice(id2.indexOf('#') + 1))
  if (typeof idFix2 !== 'number') throw new TypeMissmatchError(id2, 'number')

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player1 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player1) throw new PlayerNotFoundError(data.playerPhone)

  const pokemon1 = await prismaClient.pokemon.findFirst({
    where: {
      id: idFix1,
      ownerId: player1.id,
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
  if (!pokemon1) throw new PlayersPokemonNotFoundError(idFix1, player1.name)

  const pokemon2 = await prismaClient.pokemon.findFirst({
    where: {
      id: idFix2,
      ownerId: player1.id,
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
  if (!pokemon2) throw new PlayersPokemonNotFoundError(idFix2, player1.name)

  const getChildrenCount = (poke: IPokemon): number => {
    if (!poke.childrenId1) return 0
    if (!poke.childrenId2) return 1
    if (!poke.childrenId3) return 2
    if (!poke.childrenId4) return 3
    return 4
  }

  const poke1ChildrenCount = getChildrenCount(pokemon1)
  if (Number(amount) > 4 - poke1ChildrenCount)
    throw new PokemonAlreadyHasChildrenError(pokemon1.id, pokemon1.baseData.name, amount)

  const poke2ChildrenCount = getChildrenCount(pokemon2)
  if (Number(amount) > 4 - poke2ChildrenCount)
    throw new PokemonAlreadyHasChildrenError(pokemon2.id, pokemon2.baseData.name, amount)

  const getBreedingCosts = (poke: IPokemon) => {
    if (!poke.childrenId1) return 100
    if (!poke.childrenId2) return 200
    if (!poke.childrenId3) return 500
    if (!poke.childrenId4) return 1000
    return 9999
  }
  const totalCost = getBreedingCosts(pokemon1) + getBreedingCosts(pokemon2)
  if (player1.cash < totalCost) throw new InsufficientFundsError(player1.name, player1.cash, totalCost)

  if (confirm === 'CONFIRM') {
    for (let i = 0; i < Number(amount); i++) {
      await prismaClient.player.update({
        where: {
          id: player1.id,
        },
        data: {
          cash: {
            decrement: totalCost,
          },
        },
      })

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
        throw new Error('p1updatechildrendata error')
      }

      const poke1ChildCount = poke1ChildrenCount
      await prismaClient.pokemon.update({
        where: {
          id: pokemon1.id,
        },
        data: updateChildrenData(poke1ChildCount),
      })

      const poke2ChildCount = poke2ChildrenCount
      await prismaClient.pokemon.update({
        where: {
          id: pokemon2.id,
        },
        data: updateChildrenData(poke2ChildCount),
      })

      const imageUrl = await iGenPokemonAnalysis({
        pokemonData: newBaby,
      })

      const zapClient = container.resolve<Client>('ZapClientInstance1')

      const media = MessageMedia.fromFilePath(imageUrl as string)
      await zapClient.sendMessage(data.groupCode, media, {
        caption: `#${newBaby.id}-${newBaby.baseData.name} foi gerado por breed de #${pokemon1.id} ${pokemon1.baseData.name} e #${pokemon2.id} ${pokemon2.baseData.name}`,
      })
    }
    return {
      message: ``,
      status: 200,
      data: null,
    }
  }

  const imageUrl = await iGenPokemonBreed({
    pokemon1: pokemon1,
    pokemon2: pokemon2,
  })

  return {
    message: `Para realizar o breed de ${amount} filhotes, será necessário pagar ${totalCost} POKECOINS. 
    
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pokezap. breed ${pokemon1.id} ${pokemon2.id} ${amount} confirm`],
  }
}
