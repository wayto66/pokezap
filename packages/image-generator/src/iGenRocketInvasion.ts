import { BasePokemon, Pokemon } from '../../../common/types/prisma'
import { createCanvas2d, drawBackground } from './helpers/canvasHelper'
import { removeFileFromDisk, saveFileOnDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'

type TParams = {
  pokemons: (Pokemon & {
    baseData: BasePokemon
  })[]
}

export const iGenRocketInvasion = async (data: TParams) => {
  const { pokemons } = data

  const canvas2d = await createCanvas2d(1)

  const backgroundImage = await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/rocket-invasion.png')
  drawBackground(canvas2d, backgroundImage)

  await canvas2d.draw({
    height: 80,
    width: 80,
    positionY: 340,
    positionX: 170,
    image: await loadOrSaveImageFromCache(pokemons[0]?.spriteUrl),
  })
  canvas2d.write({
    fillStyle: 'white',
    font: '11px Pokemon',
    positionX: 190,
    positionY: 420,
    textAlign: 'center',
    text: `lvl-${pokemons[0].level}`,
  })

  await canvas2d.draw({
    height: 80,
    width: 80,
    positionY: 340,
    positionX: 260,
    image: await loadOrSaveImageFromCache(pokemons[1]?.spriteUrl),
  })
  canvas2d.write({
    fillStyle: 'white',
    font: '11px Pokemon',
    positionX: 280,
    positionY: 420,
    textAlign: 'center',
    text: `lvl-${pokemons[1].level}`,
  })

  const filepath = await saveFileOnDisk(canvas2d)
  removeFileFromDisk(filepath)

  return filepath
}
