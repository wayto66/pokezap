import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client } from 'whatsapp-web.js'

type TParams = {
  prismaClient: PrismaClient
  zapClient: Client
  needIncense?: boolean
}

export const questAnnouncement = async (data: TParams) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const check = await prismaClient.quest.findFirst()
  if (check?.category !== 'on') return

  const gameRooms = await prismaClient.gameRoom.findMany({
    where: {
      mode: 'route',
    },
  })

  for (const gameRoom of gameRooms) {
    data.zapClient.sendMessage(
      gameRoom.phone,
      '*COMPETIÇÃO DE CAPTURAS ÚNICAS* \n\n Até o final de domingo (21/04), os 5 jogadores do topo do ranking de capturas únicas receberam a premiação! \n\n utilize: pz. rank catch \n\n [dsb]',
      {}
    )
  }
}
