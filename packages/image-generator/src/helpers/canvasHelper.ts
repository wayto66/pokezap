import { Canvas, Image, PNGStream, createCanvas } from 'canvas'
import GIFEncoder from 'gifencoder'
import { loadOrSaveImageFromCache } from './loadOrSaveImageFromCache'

export const CANVAS_WIDTH = 500
export const CANVAS_HEIGHT = 500
export const SPRITE_AVATAR_WIDTH = 200
export const SPRITE_AVATAR_HEIGHT = 200

type TDrawBar = {
  type: 'hp' | 'mana'
  xOffset: number
  value: number
}

type TDraw = {
  image: Image | Canvas
  positionX: number
  positionY: number
  width: number
  height: number
}

type TDrawCircle = {
  circleRadius: number
  circleColor: string
  positionX: number
  positionY: number
}

type TFillRect = {
  fillStyle?: string
  x: number
  y: number
  w: number
  h: number
}

type TWrite = {
  font: string
  fillStyle: string
  textAlign: CanvasTextAlign
  text: string
  positionX: number
  positionY: number
  strokeStyle?: string
  strokeText?: boolean
}

export type TCanvas2D = {
  canvas: Canvas
  draw: (data: TDraw) => Promise<void>
  fillRect: (data: TFillRect) => void
  drawCircle: (data: TDrawCircle) => void
  drawBar: (data: TDrawBar) => void
  write: (data: TWrite) => void
  createStream: () => PNGStream
  clearArea: () => void
  addFrameToEncoder: (encoder: GIFEncoder) => void
  toBuffer: () => Buffer
  getImageData: () => Uint8ClampedArray
  toDataURL: () => string
  invertHorizontally: () => void
}

type TDrawPlayerData = {
  canvas2d: TCanvas2D
  avatarPositionX: number
  avatarPositionY: number
  spriteUrl: string
  name: string
  namePositionX: number
  namePositionY: number
  elo: string
  eloPositionX: number
  eloPositionY: number
  textAlign: CanvasTextAlign
}

type TDrawPokemonData = {
  canvas2d: TCanvas2D
  positionX: number
  positionY: number
  imageUrl: string
  id: string
  idPositionX: number
  idPositionY: number
  textAlign: CanvasTextAlign
  isGiant: boolean
}

type TWriteSkills = {
  canvas2d: TCanvas2D
  value: string
  positionX: number
  positionY: number
}

export const createCanvas2d = async (
  globalAlpha: number,
  isSmoothing = false,
  width?: number
): Promise<Canvas & TCanvas2D> => {
  const canvas = createCanvas(width ?? CANVAS_WIDTH, CANVAS_HEIGHT)
  const context = canvas.getContext('2d')

  context.globalAlpha = globalAlpha
  context.imageSmoothingEnabled = isSmoothing

  const draw = async ({ height, image, positionX, positionY, width }: TDraw) => {
    context.drawImage(image, positionX, positionY, width, height)
  }

  const fillRect = async ({ x, y, w, h, fillStyle }: TFillRect) => {
    if (fillStyle) context.fillStyle = fillStyle
    context.fillRect(x, y, w, h)
  }

  const drawCircle = ({ circleColor, circleRadius, positionX, positionY }: TDrawCircle) => {
    context.beginPath()
    context.arc(positionX + 21, positionY + 21, circleRadius, 0, Math.PI * 2)
    context.fillStyle = circleColor
    context.fill()
  }

  const write = ({
    fillStyle,
    strokeStyle,
    strokeText = false,
    font,
    positionX,
    positionY,
    text,
    textAlign,
  }: TWrite) => {
    context.font = font
    context.fillStyle = fillStyle
    context.textAlign = textAlign
    if (strokeStyle) context.strokeStyle = strokeStyle
    if (strokeText) context.strokeText(text, positionX, positionY)

    context.fillText(text, positionX, positionY)
  }

  const createStream = (): PNGStream => {
    return canvas.createPNGStream({ compressionLevel: 0 })
  }

  const clearArea = () => {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  }

  const drawBar = ({ type, xOffset, value }: TDrawBar) => {
    if (type === 'hp') {
      context.fillStyle = 'rgb(160, 40, 40)'
      context.fillRect(xOffset, 108, Math.max(0, value * 125), 7)
    } else {
      context.fillStyle = 'rgb(50,121,211)'
      context.fillRect(xOffset - 55, 145, Math.max(0, value * 175), 3)
    }
  }

  const addFrameToEncoder = (encoder: GIFEncoder) => {
    encoder.addFrame(context as any)
  }

  const toBuffer = () => canvas.toBuffer()

  const getImageData = () => context.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT).data

  const toDataURL = () => canvas.toDataURL()

  const invertHorizontally = () => {
    context.translate(width ?? 500, 0)
    context.scale(-1, 1)
  }

  const createJPEGStream = canvas.createJPEGStream
  const createPDFStream = canvas.createPDFStream
  const createPNGStream = canvas.createPNGStream
  const getContext = canvas.getContext

  return {
    invertHorizontally,
    fillRect,
    draw,
    drawBar,
    drawCircle,
    write,
    createStream,
    clearArea,
    addFrameToEncoder,
    toBuffer,
    getImageData,
    toDataURL,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    type: 'image',
    stride: 0,
    PNG_FILTER_AVG: 0,
    PNG_ALL_FILTERS: 0,
    PNG_FILTER_NONE: 0,
    PNG_FILTER_PAETH: 0,
    PNG_FILTER_SUB: 0,
    PNG_FILTER_UP: 0,
    PNG_NO_FILTERS: 0,
    createJPEGStream,
    createPDFStream,
    createPNGStream,
    getContext,
    canvas,
  }
}

export const drawBackground = (canvas2d: TCanvas2D, backgroundImage: Image | Canvas) => {
  const backgroundPositionX = 0
  const backgroundPositionY = 0

  canvas2d.draw({
    image: backgroundImage,
    positionX: backgroundPositionX,
    positionY: backgroundPositionY,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  })
}

export const drawAvatarPlayer = async ({
  canvas2d,
  avatarPositionX,
  avatarPositionY,
  spriteUrl,
  name,
  namePositionX,
  namePositionY,
  elo,
  eloPositionX,
  eloPositionY,
  textAlign,
}: TDrawPlayerData) => {
  const player1ImageUrl = `./src/assets/sprites/avatars/${spriteUrl}`
  const player1AvatarImage = await loadOrSaveImageFromCache(player1ImageUrl)

  canvas2d.draw({
    image: player1AvatarImage,
    positionX: avatarPositionX,
    positionY: avatarPositionY,
    width: SPRITE_AVATAR_WIDTH,
    height: SPRITE_AVATAR_HEIGHT,
  })
  canvas2d.write({
    font: '21px Righteous',
    fillStyle: 'white',
    textAlign,
    text: `${name.toUpperCase()}`,
    positionX: namePositionX,
    positionY: namePositionY,
  })
  canvas2d.write({
    font: '14px Righteous',
    fillStyle: 'white',
    textAlign,
    text: `RANK: ${elo}`,
    positionX: eloPositionX,
    positionY: eloPositionY,
  })
}

export const drawPokemon = async ({
  canvas2d,
  positionX,
  positionY,
  imageUrl,
  id,
  idPositionX,
  idPositionY,
  textAlign,
  isGiant,
}: TDrawPokemonData) => {
  const pokemonPlayer1Image = await loadOrSaveImageFromCache(imageUrl)

  canvas2d.draw({
    image: pokemonPlayer1Image,
    positionX,
    positionY,
    width: SPRITE_AVATAR_WIDTH * (isGiant ? 1.5 : 1),
    height: SPRITE_AVATAR_HEIGHT * (isGiant ? 1.5 : 1),
  })
  canvas2d.write({
    font: '16px Righteous',
    fillStyle: 'white',
    textAlign,
    text: `#${id}`,
    positionX: idPositionX,
    positionY: idPositionY,
  })
}

export const drawTalents = (
  canvas2d: TCanvas2D,
  talentImageMap: Map<string, Image>,
  talents: (string | undefined)[],
  xOffset: number
) => {
  if (!talents) return

  const NUM_TALENTS = 9
  for (let i = 0; i < NUM_TALENTS; i++) {
    const talent = talents[i]
    if (!talent) return

    const image = talentImageMap.get(talent)
    if (!image) return

    const positionX = xOffset + i * 22
    const positionY = 400

    canvas2d.drawCircle({
      circleRadius: 10,
      circleColor: 'rgba(0,0,0,0.5)',
      positionX,
      positionY,
    })

    canvas2d.draw({
      image,
      positionX,
      positionY,
      width: 21,
      height: 21,
    })
  }
}

export const getTalent = async (name: string) => {
  const talentImageUrl = `./src/assets/sprites/UI/types/circle/${name}.png`

  return await loadOrSaveImageFromCache(talentImageUrl)
}

export const writeSkills = ({ canvas2d, value, positionX, positionY }: TWriteSkills) => {
  canvas2d.write({
    font: '18px Righteous',
    fillStyle: 'white',
    textAlign: 'start',
    text: value,
    positionX,
    positionY,
  })
}
