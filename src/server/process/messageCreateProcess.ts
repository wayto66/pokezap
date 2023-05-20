import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { Client, Message, MessageMedia } from 'whatsapp-web.js'
import { router } from '../../infra/routes/router'
import { verifyTargetChat } from '../../server/helpers/verifyTargetChat'
import { IResponse } from '../../server/models/IResponse'

export const messageCreateProcess = async (msg: Message, instanceName: string) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const zapClient = container.resolve<Client>(instanceName)

  const permit = await verifyTargetChat(msg.to)
  if (!permit) return

  if (msg.body.includes('[dsb]') && (msg.from === '5516988675837:23@c.us' || msg.from === '5516988675837@c.us')) return

  if (msg.body.toUpperCase().includes('POKEZAP.') || msg.body.toUpperCase().includes('PZ.')) {
    const contact = await msg.getContact()

    if (msg.body.includes('[dsb]')) return

    const playerPhone = () => {
      if (!msg.author) return msg.from

      const match = msg.author.match(/^(\d+):(\d+)@c\.us$/)
      if (match) {
        return `${match[1]}@c.us`
      }

      return msg.author
    }

    const response: IResponse = await router({
      playerPhone: playerPhone(),
      routeParams: msg.body.toUpperCase().split(' '),
      playerName: contact.pushname ? contact.pushname : 'Nome indefinido',
      groupCode: msg.to,
    })

    if (response.react) {
      msg.react(response.react)
      return
    }

    if (!response.imageUrl) {
      const result = await msg.reply(response.message)
      if (response.actions) {
        await prismaClient.message.create({
          data: {
            msgId: result.id.id,
            type: 'default',
            body: result.body,
            actions: response.actions,
          },
        })
      }
      return
    }
    const media = MessageMedia.fromFilePath(response.imageUrl)
    const result = await zapClient.sendMessage(msg.id.remote, media, {
      caption: response.message,
    })
    if (response.actions) {
      await prismaClient.message.create({
        data: {
          msgId: result.id.id,
          type: 'default',
          body: result.body,
          actions: response.actions,
        },
      })
    }
  }
}
