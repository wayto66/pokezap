import fs from 'fs'
import { TCanvas2D } from './canvasHelper'
import path from 'path'

export const saveFileOnDisk = async (canvas2d: TCanvas2D): Promise<string> => {
  const filepath: string = await new Promise(resolve => {
    const filename = `../modules/imageGen/images/image-${Math.random()}.png`
    const filepath = path.join(__dirname, filename)
    const out = fs.createWriteStream(filepath)
    const stream = canvas2d.createStream()
    stream.pipe(out)
    out.on('finish', () => {
      console.log('The PNG file was created.')
      resolve(filepath)
    })
  })

  return filepath
}

export const removeFileFromDisk = (filepath: string) => {
  setTimeout(() => {
    fs.unlink(filepath, error => {
      if (error) {
        console.error(`Failed to delete file: ${error}`)
      } else {
        console.log('File deleted successfully.')
      }
    })
  }, 15000)
}
