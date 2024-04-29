import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerAlreadyExists } from '../../../../infra/errors/AppErrors'
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
  if (player) throw new PlayerAlreadyExists(data.playerName)

  if (gender) {
    return await newUser2(data)
  }

  console.log('creating private-route for: ', data.playerPhone)

  await prismaClient.gameRoom.create({
    data: {
      level: 1,
      experience: 0,
      phone: data.playerPhone,
      mode: 'private',
    },
  })

  return {
    message: `Bem vindo(a) ao PokeZap! [dsb]
    Para interagir com o bot, sempre comece sua mensagem com o código "pz. " e separe as palavras com espaço.
    
    Para começar, seu personagem será menino ou menina?
    
👍 - menino
❤ - menina

ATENÇÃO: voce deve reagir com o emoji nesta mensagem que estou enviando.
    `,
    status: 200,
    actions: ['pokezap. iniciar menino', 'pokezap. iniciar menina'],
    data: null,
  }
}
