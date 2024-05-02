import { Image } from 'canvas'
import cache from 'memory-cache'
import { createCanvas2d, drawBackground } from './helpers/canvasHelper' // Importação de funções auxiliares relacionadas ao canvas
import { removeFileFromDisk, saveFileOnDisk } from './helpers/fileHelper' // Importação de funções auxiliares relacionadas a arquivos
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'

type TParams = {
  genre: 'male' | 'female' // Definição do tipo para o parâmetro 'genre'
}

let canvas2d // Declaração da variável 'canvas2d'

export const iGenAvatarChoose = async (data: TParams) => {
  canvas2d = await createCanvas2d(1) // Criação de um novo canvas

  const backgroundImage = await loadBackgroundImage() // Carregamento da imagem de plano de fundo
  drawBackground(canvas2d, backgroundImage) // Desenho do plano de fundo no canvas

  const imageCount = 4 // Número de imagens de avatar
  const { images, positions } = await loadAvatarImages(`./src/assets/sprites/avatars/${data.genre}/`, imageCount) // Carregamento das imagens de avatar e suas posições
  await drawAvatarImages(canvas2d, images, positions, imageCount) // Desenho das imagens de avatar no canvas

  const filepath = await saveFileOnDisk(canvas2d) // Salvamento do canvas como um arquivo no disco

  removeFileFromDisk(filepath) // Remoção do arquivo do disco

  return filepath // Retorno do caminho do arquivo
}

const loadBackgroundImage = async () => {
  return await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/player_choose_avatar.png') // Carregamento da imagem de plano de fundo
}

const loadAvatarImages = async (avatarUrlBase: string, imageCount: number) => {
  const images: Image[] = [] // Array para armazenar as imagens de avatar
  const positions: { positionX: number; positionY: number }[][] = [] // Matriz para armazenar as posições das imagens de avatar

  for (let i = 0; i < imageCount; i++) {
    const row: { positionX: number; positionY: number }[] = [] // Array para armazenar as posições de uma linha

    for (let j = 0; j < imageCount; j++) {
      const positionX = 35 + j * 112 // Cálculo da posição X da imagem
      const positionY = 37 + i * 107 // Cálculo da posição Y da imagem
      const imageUrl = `${avatarUrlBase}${imageCount * i + j + 1}.png` // URL da imagem de avatar
      let image = cache.get(imageUrl) as Image // Recuperação da imagem do cache, se disponível

      if (!image) {
        const imageData = await loadOrSaveImageFromCache(imageUrl) // Carregamento da imagem de avatar
        image = new Image() // Criação de uma nova instância de Image
        image.src = imageData.src // Atribuição do src da imagem
        cache.put(imageUrl, imageData) // Armazenamento da imagem no cache
      }

      images.push(image) // Adição da imagem ao array de imagens
      row.push({ positionX, positionY }) // Adição da posição ao array de posições da linha
    }

    positions.push(row) // Adição da linha de posições à matriz de posições
  }

  return { images, positions } // Retorno das imagens e posições
}

const drawAvatarImages = (
  canvas2d: any,
  images: Image[],
  positions: { positionX: number; positionY: number }[][],
  imageCount: number
) => {
  const imagePromises: Promise<void>[] = [] // Array de promessas para o desenho das imagens
  const imageSize = 100 // Tamanho da imagem

  for (let i = 0; i < images.length; i++) {
    const image = images[i] // Imagem atual
    const position = positions[Math.floor(i / imageCount)][i % imageCount] // Posição atual da imagem

    imagePromises.push(
      canvas2d.draw({
        image,
        positionX: position.positionX,
        positionY: position.positionY,
        width: imageSize,
        height: imageSize,
      }) // Adição da promessa de desenho da imagem ao array
    )
  }

  return Promise.all(imagePromises) // Retorno de uma promessa que aguarda todas as imagens serem desenhadas
}
