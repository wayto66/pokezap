import { PrismaClient } from '@prisma/client'
import ffmpeg from 'fluent-ffmpeg'
import { container } from 'tsyringe'
import { Client, Message, MessageMedia } from 'whatsapp-web.js'
import { logger } from '../../infra/logger'
import { router } from '../../infra/routes/router'
import { verifyTargetChat } from '../../server/helpers/verifyTargetChat'
import { IResponse } from '../../server/models/IResponse'
import { UserDemandHandler } from '../constants/UserDemandHandler'
import { deleteSentMessage } from '../helpers/deleteSentMessage'

const userDemand = new UserDemandHandler()

export const messageCreateProcess = async (msg: Message, instanceName: string) => {
  try {
    const prismaClient = container.resolve<PrismaClient>('PrismaClient')
    const zapClient = container.resolve<Client>(instanceName)

    const permit = await verifyTargetChat(msg.to)
    if (!permit) return

    if (msg.body.toUpperCase().includes('POKEZAP.') || msg.body.toUpperCase().includes('PZ.')) {
      const contact = await msg.getContact()

      if (msg.body.includes('[dsb]')) return
      if (msg.body.includes('[d]')) return

      const getPlayerPhone = () => {
        if (!msg.author) return msg.from

        const match = msg.author.match(/^(\d+):(\d+)@c\.us$/)
        if (match) {
          return `${match[1]}@c.us`
        }

        return msg.author
      }
      const playerPhone = getPlayerPhone()

      const demand = userDemand.get(playerPhone)
      if (demand && demand >= 3) {
        msg.react('💤')
        return
      }
      userDemand.add(playerPhone, 1)
      setTimeout(() => userDemand.reduce(playerPhone, 1), 2000)

      const response: IResponse = await router({
        playerPhone,
        routeParams: msg.body.toUpperCase().split(' '),
        playerName: contact.pushname ? contact.pushname : 'Nome indefinido',
        groupCode: msg.id.remote,
      })

      if (response.react) {
        msg.react(response.react)
        return
      }

      if (!response.imageUrl) {
        const result = await msg.reply(response.message)
        if (msg.id.remote.includes('@g.us')) deleteSentMessage(result)
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
        if (response.afterMessage) {
          const msgBody = response.afterMessage
          setTimeout(async () => {
            await zapClient.sendMessage(msg.id.remote, msgBody)
            if (msg.id.remote.includes('@g.us')) deleteSentMessage(result)
          }, response.afterMessageDelay || 5000)
        }
        return
      }

      const filePath = response.isAnimated
        ? await new Promise<string>(resolve => {
            if (!response.isAnimated) resolve(response.imageUrl!)

            const outputPath = `./src/server/modules/imageGen/images/video-${Math.random().toFixed(5)}`

            if (!response.imageUrl) return

            ffmpeg(response.imageUrl)
              .output(outputPath)
              .noAudio()
              .on('end', () => {
                console.log('Conversão concluída!')
                resolve(outputPath)
              })
              .on('error', err => {
                console.log('Ocorreu um erro durante a conversão:', err)
              })
              .run()
          }).catch(err => {
            logger.error(err)
            return ''
          })
        : response.imageUrl

      const media = MessageMedia.fromFilePath(filePath)
      const result = await zapClient.sendMessage(msg.id.remote, response.message, {
        media: media,
      })
      if (msg.id.remote.includes('@g.us')) deleteSentMessage(result)

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

      if (response.afterMessage) {
        const msgBody = response.afterMessage
        const chatId = msg.id.remote
        setTimeout(async () => {
          const msg = await zapClient.sendMessage(chatId, msgBody)
          if (chatId.includes('@g.us')) deleteSentMessage(msg)
        }, response.afterMessageDelay || 5000)
      }
      return
    }
  } catch (e: any) {
    console.log(e)
    logger.error(e)
  }
}
