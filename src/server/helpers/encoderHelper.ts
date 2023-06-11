import fs from 'fs'
import GIFEncoder from 'gifencoder'

export const initEncoder = (filepath: string) => {
  const encoder = new GIFEncoder(500, 500)

  encoder.createReadStream().pipe(fs.createWriteStream(filepath))

  encoder.start()
  encoder.setRepeat(0) // 0 for repeat, -1 for no-repeat
  encoder.setDelay(200) // Delay between frames in milliseconds
  encoder.setQuality(10) // Image quality (lower is better)

  return encoder
}
