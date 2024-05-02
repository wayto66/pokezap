import { Router } from 'express'
import { sendMessageController } from '../modules/sendMessage/sendMessageController'

const expressRouter = Router() as any

expressRouter.post('/send-message', sendMessageController)

export default expressRouter
