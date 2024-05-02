import { talentIdMap } from '../../../common/constants/talentIdMap'
import { PokemonBaseDataSkillsHeld } from '../../../common/types'
import { InvasionSession } from '../../../common/types/prisma'
import { createCanvas2d, drawBackground, getTalent } from './helpers/canvasHelper'
import { removeFileFromDisk, saveFileOnDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'

type TParams = {
  pokemon1: PokemonBaseDataSkillsHeld
  pokemon2: PokemonBaseDataSkillsHeld
  invasionSession: InvasionSession
}

export const iGenRocketInvasionX2 = async (data: TParams) => {
  const { pokemon1, pokemon2, invasionSession } = data

  const canvas2d = await createCanvas2d(1)

  const backgroundImage = await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/rocket_invasion_x2.png')
  drawBackground(canvas2d, backgroundImage)

  const rocketAvatarSpriteUrl = './src/assets/sprites/rocket avatars/' + Math.ceil(Math.random() * 3) + '.png'

  await canvas2d.draw({
    height: 300,
    width: 300,
    positionX: 100,
    positionY: 100,
    image: await loadOrSaveImageFromCache(rocketAvatarSpriteUrl),
  })

  await canvas2d.draw({
    height: 150,
    width: 150,
    positionY: 75,
    positionX: 50,
    image: await loadOrSaveImageFromCache(pokemon1.spriteUrl),
  })

  await canvas2d.draw({
    height: 150,
    width: 150,
    positionY: 290,
    positionX: 50,
    image: await loadOrSaveImageFromCache(pokemon2.spriteUrl),
  })

  canvas2d.write({
    fillStyle: 'white',
    font: '16px Pokemon',
    positionX: 5,
    positionY: 315,
    textAlign: 'start',
    text: 'lvl: ' + pokemon1.level,
  })

  canvas2d.write({
    fillStyle: 'white',
    font: '16px Pokemon',
    positionX: 495,
    positionY: 315,
    textAlign: 'end',
    text: 'lvl: ' + pokemon2.level,
  })

  canvas2d.write({
    fillStyle: 'white',
    font: '32px Pokemon',
    positionX: 250,
    positionY: 10,
    textAlign: 'center',
    text: invasionSession.name,
  })

  const talentsPokemon1 = getTalents(pokemon1)
  const talentsPokemon2 = getTalents(pokemon2)

  const NUM_TALENTS = 9
  const TALENT_SIZE = 18
  const TALENT_OFFSET_X = 20
  const y = 470

  for (let i = 0; i < NUM_TALENTS; i++) {
    const talentPokemon1 = talentsPokemon1[i]
    const talentPokemon2 = talentsPokemon2[i]

    if (!talentPokemon1 || !talentPokemon2) {
      throw new Error(`Invalid talents: ${i}`)
    }

    const xPlayer1 = 5 + i * TALENT_OFFSET_X
    canvas2d.draw({
      image: await getTalent(talentPokemon1),
      positionX: xPlayer1,
      positionY: y,
      width: TALENT_SIZE,
      height: TALENT_SIZE,
    })

    const xPlayer2 = 325 + i * TALENT_OFFSET_X
    canvas2d.draw({
      image: await getTalent(talentPokemon2),
      positionX: xPlayer2,
      positionY: y,
      width: TALENT_SIZE,
      height: TALENT_SIZE,
    })
  }

  const filepath = await saveFileOnDisk(canvas2d)
  removeFileFromDisk(filepath)

  return filepath
}

const getTalents = (pokemon: any) => {
  const talents: (string | undefined)[] = []
  for (let i = 1; i <= 9; i++) {
    const talent = talentIdMap.get(pokemon[`talentId${i}`])
    talents.push(talent)
  }
  return talents
}
