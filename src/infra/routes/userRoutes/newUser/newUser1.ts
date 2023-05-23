import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { newUser2 } from './newUser2'

export const newUser1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , gender] = data.routeParams

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (player) throw new PlayerNotFoundError(data.playerName)

  if (gender) {
    return await newUser2(data)
  }

  return {
    message: `Bem vindo(a) ao PokeZap! Para começar, seu personagem será menino ou menina?
    
👍 - menino
❤ - menina
    `,
    status: 200,
    actions: ['pokezap. iniciar menino', 'pokezap. iniciar menina'],
    data: null,
  }
}
