import { Image, loadImage } from 'canvas'
import cache from 'memory-cache'

export const loadOrSaveImageFromCache = async (imageUrl: string | Buffer): Promise<Image> => {
  const imageInCache = cache.get(imageUrl) as Image // Recuperação da imagem do cache, se disponível
  if (imageInCache) return imageInCache
  const newImage = await loadImage(imageUrl)
  cache.put(imageUrl, newImage) // Armazenamento da imagem no cache
  return newImage
}
