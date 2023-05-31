import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import { container } from 'tsyringe'
import { Client, MessageMedia, Reaction } from 'whatsapp-web.js'
import { router } from '../../infra/routes/router'
import { reactions } from '../../server/constants/reactions'
import { verifyTargetChat } from '../../server/helpers/verifyTargetChat'
import { IResponse } from '../../server/models/IResponse'
import { metaValues } from '../../constants/metaValues'

export const messageReactionProcess = async (msg: Reaction, instanceName: string) => {
  try {
    const permit = await verifyTargetChat(msg.msgId.remote)
    if (!permit) return

    const prismaClient = container.resolve<PrismaClient>('PrismaClient')
    const zapClient = container.resolve<Client>(instanceName)

    const message = await prismaClient.message.findFirst({
      where: {
        msgId: msg.msgId.id,
      },
    })

    if (!message) return

    const currentTimestamp: number = Math.floor(Date.now() / 1000)
    const difference: number = moment
      .duration(currentTimestamp - Math.floor(new Date(message.createdAt).getTime() / 1000), 'seconds')
      .asMinutes()
    if (difference >= 30) {
      console.log('ignoring old msg. difference: ' + difference)
      return
    }

    const player = await prismaClient.player.findFirst({
      where: {
        phone: msg.senderId,
      },
    })

    console.log({ react: msg.reaction })

    const getRequestedAction = () => {
      for (let i = 0; i < message.actions.length; i++) {
        if (reactions[i].includes(msg.reaction)) {
          return message?.actions[i]?.toUpperCase().split(' ')
        }
      }
    }

    const routeParams = getRequestedAction()

    if (!routeParams) {
      console.log('no action found.')
      return
    }

    const startCheck: string = routeParams[1]

    if (!player) {
      if (startCheck !== 'START' && startCheck !== 'INICIAR' && startCheck !== 'INICIO') return
    }

    const response: IResponse = await router({
      playerPhone: msg.senderId,
      routeParams: routeParams,
      playerName: player?.name || '',
      groupCode: msg.msgId.remote,
      fromReact: true,
    })

    if (!response.imageUrl) {
      const result = await zapClient.sendMessage(msg.id.remote, response.message)
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

    console.log({ response })

    const filePath = await new Promise<string>((resolve, reject) => {
      if (!response.isAnimated) resolve(response.imageUrl!)
      const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')
      const ffprobe = require('@ffprobe-installer/ffprobe')
      const ffmpeg = require('fluent-ffmpeg')().setFfprobePath(ffprobe.path).setFfmpegPath(ffmpegInstaller.path)
      const outputPath = `./src/server/modules/imageGen/images/video-${Math.random().toFixed(5)}.mp4`
      ffmpeg
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
        .on('error', e => {
          console.log(e)
          reject('error on ffmpeg')
        })
        .run()
    }).catch(err => {
      console.log(err)
      return ''
    })

    console.log({ filePath })

    const media = MessageMedia.fromFilePath(filePath)
    const result = await zapClient.sendMessage(msg.id.remote, response.message, {
      media: media,
      sendVideoAsGif: true,
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
      const afterActions = response.afterMessageActions
      console.log({ msgBody })
      const chatId = msg.id.remote
      setTimeout(async () => {
        const result = await zapClient.sendMessage(chatId, msgBody)
        if (afterActions) {
          await prismaClient.message.create({
            data: {
              msgId: result.id.id,
              type: 'default',
              body: result.body,
              actions: afterActions,
            },
          })
        }
      }, 5000)
    }
  } catch (e: any) {
    console.error(e)
  }
}
