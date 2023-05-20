import qr from 'qrcode'

export const qrCodeProcess = (qrCodeString: string, instanceName: string) => {
  // Generate QR code image

  console.log('starting qrCodeProcess')

  const name = `qrcode-${instanceName}.png`
  qr.toFile(name, qrCodeString, err => {
    if (err) {
      console.error(err)
      return
    }
    console.log('QR code image generated successfully. name: ' + name)
  })
}
