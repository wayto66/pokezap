import { talentIdMap } from '../../../common/constants/talentIdMap'
import { BasePokemon, InvasionSession, Pokemon } from '../../../common/types/prisma'
import { createCanvas2d, drawBackground, getTalent } from './helpers/canvasHelper'
import { removeFileFromDisk, saveFileOnDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'

type TParams = {
  pokeBoss: Pokemon & {
    baseData: BasePokemon
  }
  invasionSession: InvasionSession
}

export const iGenPokeBossInvasion = async (data: TParams) => {
  const { pokeBoss, invasionSession } = data

  const canvas2d = await createCanvas2d(1)

  const backgroundImage = await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/poke_boss_invasion.png')
  drawBackground(canvas2d, backgroundImage)

  await canvas2d.draw({
    height: 300,
    width: 300,
    positionY: 70,
    positionX: 100,
    image: await loadOrSaveImageFromCache(pokeBoss.spriteUrl),
  })
  canvas2d.write({
    fillStyle: 'white',
    font: '22px Pokemon',
    positionX: 250,
    positionY: 45,
    textAlign: 'center',
    text: invasionSession.name,
  })

  // set up the table data
  const tableData = [
    [pokeBoss.hp.toString(), pokeBoss.atk.toString(), pokeBoss.def.toString()],
    [pokeBoss.speed.toString(), pokeBoss.spAtk.toString(), pokeBoss.spDef.toString()],
  ]
  // set up the table style
  const cellWidth = 80
  const cellHeight = 55
  // move the entire table to a new position
  const tableX = 295
  const tableY = 415

  for (let i = 0; i < tableData.length; i++) {
    const rowData = tableData[i]
    for (let j = 0; j < rowData.length; j++) {
      canvas2d.write({
        fillStyle: 'white',
        font: '15px Pokemon',
        positionX: tableX + j * cellWidth,
        positionY: tableY + i * cellHeight,
        text: rowData[j],
        textAlign: 'center',
      })
    }
  }

  const talentsPokemon1 = getTalents(pokeBoss)
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const talentPokemon1 = talentsPokemon1[j + i * 3]
      if (!talentPokemon1) continue
      canvas2d.draw({
        image: await getTalent(talentPokemon1),
        positionX: 67 + j * 45,
        positionY: 380 + i * 35,
        width: 30,
        height: 30,
      })
    }
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
