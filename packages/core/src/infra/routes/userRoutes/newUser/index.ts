import prisma from '../../../../../../prisma-provider/src'
import { IResponse } from '../../../../server/models/IResponse'
import { PlayerAlreadyExists } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { register1 } from './register1'
import { register2 } from './register2'
import { register4 } from './register4'
import { register5 } from './register5'
import { register6 } from './register6'

const subRouteMap = new Map<string, any>([
  // JOIN RAIND ROUTS

  ['1', register1],
  ['2', register2],
  ['MENINO', register2],
  ['MENINA', register2],
  ['4', register4],
  ['5', register5],
  ['6', register6],
])

export const register = async (data: TRouteParams): Promise<IResponse> => {
  const [, , subRoute] = data.routeParams

  const route = subRouteMap.get(subRoute ?? '????')
  if (route) return await route(data)

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (player) throw new PlayerAlreadyExists(data.playerName)

  const gameRoom = await prisma.gameRoom.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!gameRoom)
    await prisma.gameRoom.create({
      data: {
        level: 1,
        experience: 0,
        phone: data.playerPhone,
        mode: 'private',
      },
    })

  return {
    message: `[d] Bem vindo(a) ao PokeZap! 
    Para começarmos, reaja na minha mensagem com o emoji indicado:
    (Você deve reagir à mensagem, não enviar 👍 na conversa)

    👍 - Reaja com esse exato emoji
    `,
    status: 200,
    actions: ['pokezap. iniciar 1'],
    data: null,
  }
}
