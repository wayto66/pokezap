import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import { container } from 'tsyringe'
import { Client, MessageMedia, Reaction } from 'whatsapp-web.js'
import { router } from '../../infra/routes/router'
import { reactions } from '../../server/constants/reactions'
import { verifyTargetChat } from '../../server/helpers/verifyTargetChat'
import { IResponse } from '../../server/models/IResponse'

export const messageReactionProcess = async (msg: Reaction, instanceName: string) => {
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
  if (difference >= 5) {
    console.log('ignoring old msg. difference: ' + difference)
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

  const media = MessageMedia.fromFilePath(response.imageUrl)
  await zapClient.sendMessage(msg.id.remote, media, {
    caption: response.message,
  })
}
