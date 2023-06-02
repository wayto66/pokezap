import { registerFont } from 'canvas'

export const registerFonts = () => {
  registerFont('./src/assets/font/JosefinSans-Bold.ttf', { family: 'Pokemon' })
  registerFont('./src/assets/font/Righteous.ttf', { family: 'Righteous' })
}
