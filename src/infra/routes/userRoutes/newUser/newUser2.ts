import { TRouteParams } from "infra/routes/router"
import { IResponse } from "../../../../server/models/IResponse"
import { iGenAvatarChoose } from "../../../../server/modules/imageGen/iGenAvatarChoose"
import { newUser3 } from "./newUser3"

export const newUser2 = async (data: TRouteParams): Promise<IResponse> => {
  const [command, route, gender, spriteNumber] = data.routeParams
  if (spriteNumber) {
    if (Number(spriteNumber) <= 16) {
      return await newUser3(data)
    }

    return {
      status: 400,
      data: null,
      message: `ERRO: número de sprite inválido.`,
    }
  }

  if (gender === "MENINO") {
    return {
      message: `Certo! Agora escolha seu avatar!
      
      (é só enviar: pokezap start menino + número do avatar)`,
      status: 200,
      imageUrl: await iGenAvatarChoose({ genre: "male" }),
      data: null,
    }
  }

  if (gender === "MENINA") {
    return {
      message: `Certo! Agora escolha seu avatar!
      
      (é só enviar: pokezap start menina + número do avatar)`,
      status: 200,

      imageUrl: await iGenAvatarChoose({ genre: "female" }),
      data: null,
    }
  }

  return {
    message: `ERRO: Gênero "${gender}" não encontrado. Utilize: 'menino' ou 'menina'.`,
    status: 400,
    imageUrl: await iGenAvatarChoose({ genre: "female" }),
    data: null,
  }
}
