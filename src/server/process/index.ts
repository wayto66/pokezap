import { Client } from 'whatsapp-web.js'
import { authFailureProcess } from './authFailureProcess'
import { loadingScreenProcess } from './loadingScreenProcess'
import { messageCreateProcess } from './messageCreateProcess'
import { messageReactionProcess } from './messageReactionProcess'
import { qrCodeProcess } from './qrCodeProcess'
import { readyProcess } from './readyProcess'

export const handleAllProcess = (client: Client, instanceName: string) => {
  client.initialize()
  client.on('loading_screen', loadingScreenProcess)
  client.on('qr', qr => qrCodeProcess(qr, instanceName))
  client.on('auth_failure', authFailureProcess)
  client.on('ready', () => readyProcess(instanceName))
  client.on('message_reaction', async msg => messageReactionProcess(msg, instanceName))
  client.on('message_create', async msg => messageCreateProcess(msg, instanceName))
}
