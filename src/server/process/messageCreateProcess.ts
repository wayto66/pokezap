import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
// @ts-ignore
import ffprobe from '@ffprobe-installer/ffprobe'
import { PrismaClient } from '@prisma/client'
import ffmpeg from 'fluent-ffmpeg'
import { container } from 'tsyringe'
import { Client, Message, MessageMedia } from 'whatsapp-web.js'
import { logger } from '../../infra/logger'
import { router } from '../../infra/routes/router'
import { verifyTargetChat } from '../../server/helpers/verifyTargetChat'
import { IResponse } from '../../server/models/IResponse'

export const messageCreateProcess = async (msg: Message, instanceName: string) => {
  try {
    const prismaClient = container.resolve<PrismaClient>('PrismaClient')
    const zapClient = container.resolve<Client>(instanceName)

    const permit = await verifyTargetChat(msg.to)
    if (!permit) return

    if (msg.body.includes('[dsb]') && (msg.from === '5516988675837:23@c.us' || msg.from === '5516988675837@c.us'))
      return

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
        groupCode: msg.id.remote,
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
        if (response.afterMessage) {
          const msgBody = response.afterMessage
          setTimeout(async () => {
            await zapClient.sendMessage(msg.id.remote, msgBody)
          }, response.afterMessageDelay || 5000)
        }
        return
      }

      const filePath = await new Promise<string>((resolve, reject) => {
        if (!response.isAnimated) resolve(response.imageUrl!)
        const outputPath = `./src/server/modules/imageGen/images/video-${Math.random().toFixed(5)}.mp4`

        if (!response.imageUrl) return

        ffmpeg
          .setFfprobePath(ffprobe.path)
          .setFfmpegPath(ffmpegInstaller.path)
          .input(response.imageUrl)
          .outputOptions([
            '-pix_fmt yuv420p',
            '-c:v libx264',
            '-movflags +faststart',
            "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'",
          ])
          .noAudio()
          .output(outputPath)
          .on('end', () => {
            resolve(outputPath)
          })
          .on('error', (e: Error) => {
            logger.info(e)
            reject(new Error('error on ffmpeg'))
          })
          .run()
      })

      const media = MessageMedia.fromFilePath(filePath)
      const result = await zapClient.sendMessage(msg.id.remote, response.message, {
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
        const chatId = msg.id.remote
        setTimeout(async () => {
          await zapClient.sendMessage(chatId, msgBody)
        }, response.afterMessageDelay || 5000)
      }
      return
    }
  } catch (e: any) {
    console.log(e)
    logger.error(e)
  }
}
