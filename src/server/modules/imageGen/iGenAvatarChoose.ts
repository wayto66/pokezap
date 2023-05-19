import { createCanvas, loadImage, registerFont } from "canvas"
import fs from "fs"
import path from "path"

type TParams = {
  genre: "male" | "female"
}

export const iGenAvatarChoose = async (data: TParams) => {
  // Define the dimensions of the canvas and the background
  console.log({ data })
  const canvasWidth = 500
  const canvasHeight = 500
  const backgroundUrl = "./src/assets/sprites/UI/hud/player_choose_avatar.png"
  const avatarUrlBase = `./src/assets/sprites/avatars/${data.genre}/`

  // Load the font file and register it with the canvas
  registerFont("./src/assets/font/JosefinSans-Bold.ttf", { family: "Pokemon" })

  registerFont("./src/assets/font/Righteous.ttf", { family: "Righteous" })

  // Load the background image
  const background = await loadImage(backgroundUrl)

  // Create a canvas with the defined dimensions
  const canvas = createCanvas(canvasWidth, canvasHeight)
  const ctx = canvas.getContext("2d")
  ctx.imageSmoothingEnabled = false

  // Draw the background on the canvas
  ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight)

  // Calculate the position of the sprite in the middle of the canvas
  const spriteWidth = 100 // replace with the actual width of the sprite
  const spriteHeight = 100 // replace with the actual height of the sprite

  for (let i = 1; i < 5; i++) {
    for (let j = 1; j < 5; j++) {
      const sprite = await loadImage(avatarUrlBase + (4 * (i - 1) + j) + ".png")
      const spriteX = 35 + (j - 1) * 112
      const spriteY = 37 + (i - 1) * 107
      ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight)
    }
  }

  const filepath: string = await new Promise((resolve, reject) => {
    // Save the canvas to disk
    const filename = `images/image-${Math.random()}.png`
    const filepath = path.join(__dirname, filename)
    const out = fs.createWriteStream(filepath)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on("finish", () => {
      console.log("The PNG file was created.")
      resolve(filepath)
    })
  })

  // Delete the file after 5 seconds
  setTimeout(() => {
    fs.unlink(filepath, (error) => {
      if (error) {
        console.error(`Failed to delete file: ${error}`)
      } else {
        console.log("File deleted successfully.")
      }
    })
  }, 5000)

  return filepath
}
