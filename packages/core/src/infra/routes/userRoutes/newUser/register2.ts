import { iGenAvatarChoose } from '../../../../../../image-generator/src/iGenAvatarChoose'
import { IResponse } from '../../../../server/models/IResponse'
import { InvalidSpriteError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { register3 } from './register3'

export const register2 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , gender, spriteNumber] = data.routeParams
  if (spriteNumber) {
    if (Number(spriteNumber) <= 16) {
      return await register3(data)
    }

    throw new InvalidSpriteError()
  }

  if (gender === 'MENINO') {
    return {
      message: `[d] Certo! Agora escolha seu avatar!
      
      Utilize o comando:
      pz. iniciar menino numero-do-avatar    `,
      status: 200,
      imageUrl: await iGenAvatarChoose({ genre: 'male' }),
      data: null,
    }
  }

  if (gender === 'MENINA') {
    return {
      message: `[d] Certo! Agora escolha seu avatar!
      
       Utilize o comando:
      pz. iniciar menina numero-do-avatar   `,
      status: 200,

      imageUrl: await iGenAvatarChoose({ genre: 'female' }),
      data: null,
    }
  }

  return {
    message: `ERRO: Gênero "${gender}" não encontrado. Utilize: 'menino' ou 'menina'.`,
    status: 300,
    imageUrl: await iGenAvatarChoose({ genre: 'female' }),
    data: null,
  }
}
