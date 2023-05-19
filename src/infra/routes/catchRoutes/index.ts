import { IResponse } from "server/models/IResponse"
import { greatballCatch } from "./greatball"
import { pokeballCatch } from "./pokeball"

type TParams = {
  playerPhone: string
  routeParams: string[]
  playerName: string
}

const subRouteMap = new Map<string, any>([
  ["POKEBALL", pokeballCatch],
  ["POKEBOLA", pokeballCatch],
  ["PB", pokeballCatch],
  ["GREATBOLA", greatballCatch],
  ["GREATBALL", greatballCatch],
  ["GB", greatballCatch],
])

export const catchRoutes = async (data: TParams): Promise<IResponse> => {
  const [initializer, thisRoute, ballType, pokeId] = data.routeParams

  if (!ballType) {
    return {
      message: `Por favor, escolha a pokebola à ser utilizada e informe o ID do pokemon à ser capturado. Exemplo:
        poke**p. catch pokebola 25`,
      status: 300,
      data: null,
    }
  }

  const route = subRouteMap.get(ballType)

  if (!route)
    return {
      message: `ERROR: Nenhuma rota encontrada para ${ballType}, verifique a ortografia e a sintáxe do comando.`,
      status: 400,
      data: null,
    }

  return await route(data)
}
