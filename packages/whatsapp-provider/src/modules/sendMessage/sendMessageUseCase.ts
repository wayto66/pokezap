import { container } from 'tsyringe'
import WAWebJS, { Client, Message, MessageMedia } from 'whatsapp-web.js'

type Params = {
  chatId: string
  content: WAWebJS.MessageContent
  options?: WAWebJS.MessageSendOptions | undefined
  imageUrl?: string
}

export const sendMessageUseCase = async ({ chatId, content, imageUrl, options }: Params): Promise<Message> => {
  console.log({ chatId, content, imageUrl, options })
  const client = container.resolve<Client>('WhatsappClient')
  let media
  if (imageUrl) media = MessageMedia.fromFilePath(imageUrl)
  return await client.sendMessage(chatId, media ?? content, options)
}
