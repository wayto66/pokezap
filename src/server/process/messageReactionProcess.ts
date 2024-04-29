import { PrismaClient } from '@prisma/client'
import ffmpeg from 'fluent-ffmpeg'
import moment from 'moment'
import { container } from 'tsyringe'
import { Client, MessageMedia, Reaction } from 'whatsapp-web.js'
import { logger } from '../../infra/logger'
import { router } from '../../infra/routes/router'
import { reactions } from '../../server/constants/reactions'
import { verifyTargetChat } from '../../server/helpers/verifyTargetChat'
import { IResponse } from '../../server/models/IResponse'
import { UserDemandHandler } from '../constants/UserDemandHandler'
import { deleteSentMessage } from '../helpers/deleteSentMessage'

const userDemand = new UserDemandHandler()

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
    if (difference >= 60) {
      logger.info('ignoring old msg. difference: ' + difference.toFixed(2) + 'minutes')
      return
    }

    const player = await prismaClient.player.findFirst({
      where: {
        phone: msg.senderId,
      },
    })

    const getRequestedAction = () => {
      for (let i = 0; i < message.actions.length; i++) {
        if (reactions[i].includes(msg.reaction)) {
          return message?.actions[i]?.toUpperCase().split(' ')
        }
      }
    }

    const routeParams = getRequestedAction()

    if (!routeParams) return

    const startCheck: string = routeParams[1]

    if (!player) {
      if (startCheck !== 'START' && startCheck !== 'INICIAR' && startCheck !== 'INICIO') return
    }

    if (player) {
      const demand = userDemand.get(player.phone) ?? 0
      if (demand >= 4) {
        return
      }
      userDemand.add(player.phone, 1)
      setTimeout(() => userDemand.reduce(player.phone, 1), 2000)
    }

    const response: IResponse = await router({
      playerPhone: msg.senderId,
      routeParams: routeParams,
      playerName: player?.name || '',
      groupCode: msg.msgId.remote,
      fromReact: true,
    })

    if (!response) return

    if (!response.imageUrl) {
      const result = await zapClient.sendMessage(msg.id.remote, response.message)
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
      return
    }

    const filePath = response.isAnimated
      ? await new Promise<string>(resolve => {
          if (!response.isAnimated) resolve(response.imageUrl!)

          const outputPath = `./src/server/modules/imageGen/images/video-${Math.random().toFixed(5)}.mp4`

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
      const afterActions = response.afterMessageActions
      const chatId = msg.id.remote
      setTimeout(async () => {
        const result = await zapClient.sendMessage(chatId, msgBody)
        if (msg.id.remote.includes('@g.us')) deleteSentMessage(result)
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
      }, response.afterMessageDelay || 5000)
    }
  } catch (e: any) {
    console.log(e)
    logger.error(e)
  }
}
