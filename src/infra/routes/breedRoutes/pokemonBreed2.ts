import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { IPokemon } from '../../../server/models/IPokemon'
import { IResponse } from '../../../server/models/IResponse'
import { iGenPokemonAnalysis } from '../../../server/modules/imageGen/iGenPokemonAnalysis'
import { iGenPokemonBreed } from '../../../server/modules/imageGen/iGenPokemonBreed'
import { breed } from '../../../server/modules/pokemon/breed'
import { TRouteParams } from '../router'

export const pokemonBreed2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , id1, id2, amount, confirm] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (typeof Number(amount) !== 'number' || Number(amount) > 4) {
    return {
      message: `ERROR: invalid children amount.`,
      status: 400,
      data: null,
    }
  }

  if (!id1 || !id2) {
    return {
      message: `ERROR: you must provide the ids for the pokemon pair to be breeded. The correct syntax would be something like:
      pokemon breed 123 456`,
      status: 400,
      data: null,
    }
  }
  const idFix1 = Number(id1.slice(id1.indexOf('#') + 1))
  const idFix2 = Number(id2.slice(id2.indexOf('#') + 1))

  if (typeof idFix1 !== 'number' || typeof idFix2 !== 'number') {
    return {
      message: `ERROR: something is wrong with the ids. Please verify if you are using the correct syntax.`,
      status: 400,
      data: null,
    }
  }

  const player1 = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player1) {
    return {
      message: `UNEXPECTED_ERROR: no player found for phoneCode: ${data.playerPhone}`,
      status: 400,
      data: null,
    }
  }

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

  if (!pokemon1) {
    return {
      message: `ERROR: no pokemon found for id: ${idFix1} and player: ${player1.name}`,
      status: 400,
      data: null,
    }
  }

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

  if (!pokemon2) {
    return {
      message: `ERROR: no pokemon found for id: ${idFix2} and player: ${player1.name}`,
      status: 400,
      data: null,
    }
  }

  const getChildrenCount = (poke: IPokemon): number => {
    if (!poke.childrenId1) return 0
    if (!poke.childrenId2) return 1
    if (!poke.childrenId3) return 2
    if (!poke.childrenId4) return 3
    return 4
  }

  const poke1ChildrenCount = getChildrenCount(pokemon1)
  if (Number(amount) > 4 - poke1ChildrenCount)
    return {
      message: `#${pokemon1.id} ${pokemon1.baseData.name} já possui ${poke1ChildrenCount} filhotes e não é apto à conceber mais ${amount} filhotes.`,
      status: 300,
      data: null,
    }

  const poke2ChildrenCount = getChildrenCount(pokemon2)
  if (Number(amount) > 4 - poke2ChildrenCount)
    return {
      message: `#${pokemon2.id} ${pokemon2.baseData.name} já possui ${poke2ChildrenCount} filhotes e não é apto à conceber mais ${amount} filhotes.`,
      status: 300,
      data: null,
    }

  const getBreedingCosts = (poke: IPokemon) => {
    if (!poke.childrenId1) return 100
    if (!poke.childrenId2) return 200
    if (!poke.childrenId3) return 500
    if (!poke.childrenId4) return 1000
    return 9999
  }

  const totalCost = getBreedingCosts(pokemon1) + getBreedingCosts(pokemon2)

  console.log({ confirm })

  if (confirm === 'CONFIRM') {
    const poke1ChildCount = poke1ChildrenCount
    const poke2ChildCount = poke2ChildrenCount

    for (let i = 0; i < Number(amount); i++) {
      if (player1.cash < totalCost)
        return {
          message: `${player1.name} não possui POKECOINS suficientes. São necessários ${totalCost}, ainda falta ${
            totalCost - player1.cash
          } `,
          status: 300,
          data: null,
        }

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

      await prismaClient.pokemon.update({
        where: {
          id: pokemon1.id,
        },
        data: updateChildrenData(poke1ChildCount),
      })

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
        caption: `Novo pokemon gerado por breed de #${pokemon1.id} ${pokemon1.baseData.name} e #${pokemon2.id} ${pokemon2.baseData.name}`,
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
    message: `Para realizar o breed de ${amount} filhotes, será necessário pagar ${totalCost} POKECOINS.  `,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pokezap. pokemon breed ${pokemon1.id} ${pokemon2.id} ${amount} confirm`],
  }
}
