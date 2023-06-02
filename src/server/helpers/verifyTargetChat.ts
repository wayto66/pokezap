import { PrismaClient } from '@prisma/client'
import { logger } from 'infra/logger'
import { container } from 'tsyringe'

export const verifyTargetChat = async (target: string): Promise<boolean> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const gameRooms = await prismaClient.gameRoom.findMany()

  const gameRoomPhones = gameRooms.map(gameRoom => gameRoom.phone)

  if (gameRoomPhones.includes(target)) return true

  const contains = ['5516988675837@c.us', '120363125836784440@g.us', '120363129454231500@g.us'].includes(target)

  logger.info(`The bot is trying to connect to chat: ${target}`)

  return contains
}
