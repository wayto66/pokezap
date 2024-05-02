import fs from 'fs'
import path from 'path'
import { TCanvas2D } from './canvasHelper'
import { logger } from './logger'

export const saveFileOnDisk = async (canvas2d: TCanvas2D): Promise<string> => {
  const filepath: string = await new Promise(resolve => {
    const filename = `../images/image-${Math.random()}.png`
    const filepath = path.join(__dirname, filename)
    const out = fs.createWriteStream(filepath)
    const stream = canvas2d.createStream()
    stream.pipe(out)
    out.on('finish', () => {
      logger.info('The PNG file was created.')
      resolve(filepath)
    })
  })

  return filepath
}

export const removeFileFromDisk = (filepath: string, timestamp = 15000) => {
  setTimeout(() => {
    fs.unlink(filepath, error => {
      if (error) {
        logger.error(`Failed to delete file: ${error}`)
      } else {
        logger.info('File deleted successfully.')
      }
    })
  }, timestamp)
}
