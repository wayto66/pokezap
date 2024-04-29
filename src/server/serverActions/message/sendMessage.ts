import { PrismaClient } from '@prisma/client'
import ffmpeg from 'fluent-ffmpeg'
import { container } from 'tsyringe'
import { Client, MessageMedia } from 'whatsapp-web.js'
import { logger } from '../../../infra/logger'
import { IResponse } from '../../models/IResponse'

export const sendMessage = async (response: IResponse, chatId: string) => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const zapClient = container.resolve<Client>('ZapClientInstance1')

  if (!response.imageUrl) {
    const result = await zapClient.sendMessage(chatId, response.message)
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
        await zapClient.sendMessage(chatId, msgBody)
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
  const result = await zapClient.sendMessage(chatId, response.message, {
    media: media,
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

  if (response.afterMessage) {
    const msgBody = response.afterMessage
    setTimeout(async () => {
      await zapClient.sendMessage(chatId, msgBody)
    }, response.afterMessageDelay || 5000)
  }
}
