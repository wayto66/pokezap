export const verifyTargetChat = async (target: string): Promise<boolean> => {
  return ['120363269482791516@g.us'].includes(target)
  // const gameRooms = await prisma.gameRoom.findMany()

  // const gameRoomPhones = gameRooms.map(gameRoom => gameRoom.phone)

  // if (gameRoomPhones.includes(target)) return true

  // const contains = ['5516988675837@c.us', '120363125836784440@g.us', '120363129454231500@g.us'].includes(target)

  // logger.info(`The bot is trying to connect to chat: ${target}`)

  // return contains
}
