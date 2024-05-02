import { Client } from 'whatsapp-web.js'

import { authFailureProcess } from './authFailureProcess'
import { loadingScreenProcess } from './loadingScreenProcess'
import { messageCreateProcess } from './messageCreateProcess'
import { messageReactionProcess } from './messageReactionProcess'
import { qrCodeProcess } from './qrCodeProcess'
import { readyProcess } from './readyProcess'

export const handleAllProcess = async (client: Client) => {
  client.initialize()
  client.on('loading_screen', loadingScreenProcess)
  client.on('qr', qr => qrCodeProcess(qr))
  client.on('auth_failure', authFailureProcess)
  client.on('ready', readyProcess)
  client.on('message_reaction', async msg => messageReactionProcess(msg))
  client.on('message_create', async msg => messageCreateProcess(msg))
}
