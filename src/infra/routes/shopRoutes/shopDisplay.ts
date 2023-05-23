import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { NoItemsFoundError } from '../../errors/AppErrors'
import { IResponse } from '../../../server/models/IResponse'
import { TRouteParams } from '../router'
import { iGenShop } from '../../../server/modules/imageGen/iGenShop'

export const shopDisplay = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const items = await prismaClient.baseItem.findMany({
    where: {
      OR: [{ name: 'poke-ball' }, { name: 'great-ball' }, { name: 'ultra-ball' }],
    },
  })

  if (!items) throw new NoItemsFoundError()

  const imageUrl = await iGenShop({
    items,
  })

  return {
    message: `${data.playerName} acessou PokeMart!
    
    Para comprar um item envie:
    [pz] loja + posição do item + quantidade`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
