import qrcode from 'qrcode-terminal'
import { logger } from '../helpers/logger'

export const qrCodeProcess = (qrCodeString: string) => {
  logger.info('starting qrCodeProcess')

  qrcode.generate(qrCodeString, { small: true })
}
