import { PrismaClient } from "@prisma/client"
import { TRouteParams } from "infra/routes/router"
import { IResponse } from "server/models/IResponse"
import { container } from "tsyringe"

export const routeInfo = async (data: TRouteParams): Promise<IResponse> => {
  const [command, routeName, subRoute, routeId] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>("PrismaClient")

  if (!routeId) {
    const route = await prismaClient.gameRoom.findFirst({
      where: {
        phone: data.groupCode,
      },
      include: {
        upgrades: true,
        players: true,
      },
    })
    if (!route) {
      return {
        message: "ERROR: It seems that you are not on a valid route.",
        status: 400,
        data: null,
      }
    }

    return {
      message: `DUMMY: route found:
      Rota ${route.id}
      level: ${route.level}
      players: ${route.players.length}
      upgrades: ${route.upgrades.length}`,
      status: 200,
      data: null,
    }
  }

  if (typeof Number(routeId) !== "number") {
    return {
      message:
        "ERROR: invalid route id. Please verify if you are using the correct syntax.",
      status: 400,
      data: null,
    }
  }

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      id: Number(routeId),
    },
    include: {
      upgrades: true,
      players: true,
    },
  })
  if (!route) {
    return {
      message: "ERROR: No route found for id: " + Number(routeId),
      status: 400,
      data: null,
    }
  }

  return {
    message: `DUMMY: route found:
      Rota ${route.id}
      level: ${route.level}
      players: ${route.players.length}
      upgrades: ${route.upgrades.length}`,
    status: 200,
    data: null,
  }
}
