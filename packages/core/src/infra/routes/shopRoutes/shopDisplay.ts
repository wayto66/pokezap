import { iGenShop } from '../../../../../image-generator/src/iGenShop'
import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { NoItemsFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const shopDisplay = async (data: TRouteParams): Promise<IResponse> => {
  const items = await prisma.baseItem.findMany({
    where: {
      OR: [
        { name: 'poke-ball' },
        { name: 'great-ball' },
        { name: 'ultra-ball' },
        { name: 'full-incense' },
        { name: 'thunder-stone' },
        { name: 'water-stone' },
        { name: 'fire-stone' },
        { name: 'leaf-stone' },
        { name: 'shiny-incense' },
        { name: 'elemental-incense' },
        { name: 'revive' },
      ],
    },
  })

  if (!items) throw new NoItemsFoundError()

  const imageUrl = await iGenShop({
    items,
  })

  return {
    message: `Bem vindo(a) ao PokeMart!
    
    Para comprar um item envie:
    [pz] loja + posição do item + quantidade
    ou buy + nome do item + quantidade`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
