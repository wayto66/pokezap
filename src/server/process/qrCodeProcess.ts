import qr from 'qrcode'
import { logger } from '../../infra/logger'

export const qrCodeProcess = (qrCodeString: string, instanceName: string) => {
  logger.info('starting qrCodeProcess')

  const name = `qrCodes/qrcode-${instanceName}.png`
  qr.toFile(name, qrCodeString, err => {
    if (err) {
      logger.error(err)
      return
    }
    logger.info('QR code image generated successfully. name: ' + name)
  })
}
