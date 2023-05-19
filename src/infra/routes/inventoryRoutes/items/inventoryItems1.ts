import { PrismaClient } from "@prisma/client"
import { TRouteParams } from "infra/routes/router"
import { container } from "tsyringe"
import { IResponse } from "../../../../server/models/IResponse"
import { iGenInventoryItems } from "../../../../server/modules/imageGen/iGenInventoryItems"

export const inventoryItems1 = async (
  data: TRouteParams
): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>("PrismaClient")

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  if (!player)
    return {
      message: "ERROR: No player found with code " + data.playerPhone,
      status: 400,
      data: null,
    }

  const imageUrl = await iGenInventoryItems({
    playerData: player,
  })

  return {
    message: "Invetário de " + player.name,
    status: 200,
    data: null,
    imageUrl: imageUrl,
  }
}
