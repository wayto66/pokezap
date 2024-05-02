import { talentIdMap } from '../../../common/constants/talentIdMap'
import { createCanvas2d, drawAvatarPlayer, drawBackground, drawPokemon, getTalent } from './helpers/canvasHelper'
import { removeFileFromDisk, saveFileOnDisk } from './helpers/fileHelper'
import { loadOrSaveImageFromCache } from './helpers/loadOrSaveImageFromCache'

type TParams = {
  player1: any
  player2: any
}

export const iGenDuelX1 = async (data: TParams) => {
  const { spriteUrl: spriteUrl1, name: name1, elo: elo1 } = data.player1
  const { spriteUrl: spriteUrl2, name: name2, elo: elo2 } = data.player2

  const canvas2d = await createCanvas2d(1)

  const backgroundImage = await loadOrSaveImageFromCache('./src/assets/sprites/UI/hud/duel_x1.png')
  drawBackground(canvas2d, backgroundImage)

  await drawAvatarPlayer({
    canvas2d,
    avatarPositionX: 0,
    avatarPositionY: 90,
    spriteUrl: spriteUrl1,
    name: name1,
    elo: elo1,
    namePositionX: 5,
    namePositionY: 55,
    eloPositionX: 51,
    eloPositionY: 75,
    textAlign: 'start',
  })
  await drawAvatarPlayer({
    canvas2d,
    avatarPositionX: 300,
    avatarPositionY: 90,
    spriteUrl: spriteUrl2,
    name: name2,
    namePositionX: 495,
    namePositionY: 55,
    elo: elo2,
    eloPositionX: 450,
    eloPositionY: 75,
    textAlign: 'end',
  })
  await drawPokemon({
    canvas2d,
    positionX: 0,
    positionY: 275,
    imageUrl: data.player1.teamPoke1.spriteUrl,
    id: data.player1.teamPoke1.id,
    idPositionX: 5,
    idPositionY: 340,
    textAlign: 'start',
    isGiant: data.player1.teamPoke1.isGiant,
  })
  await drawPokemon({
    canvas2d,
    positionX: 300,
    positionY: 275,
    imageUrl: data.player2.teamPoke1.spriteUrl,
    id: data.player2.teamPoke1.id,
    idPositionX: 495,
    idPositionY: 340,
    textAlign: 'end',
    isGiant: data.player2.teamPoke1.isGiant,
  })

  const talentsPokemonPlayer1 = getTalents(data.player1)
  const talentsPokemonPlayer2 = getTalents(data.player2)

  const NUM_TALENTS = 9
  const TALENT_SIZE = 18
  const TALENT_OFFSET_X = 20
  const y = 470

  for (let i = 0; i < NUM_TALENTS; i++) {
    const talentPokemonPlayer1 = talentsPokemonPlayer1[i]
    const talentPokemonPlayer2 = talentsPokemonPlayer2[i]

    if (!talentPokemonPlayer1 || !talentPokemonPlayer2) {
      throw new Error(`Invalid talents: ${i}`)
    }

    const xPlayer1 = 5 + i * TALENT_OFFSET_X
    canvas2d.draw({
      image: await getTalent(talentPokemonPlayer1),
      positionX: xPlayer1,
      positionY: y,
      width: TALENT_SIZE,
      height: TALENT_SIZE,
    })

    const xPlayer2 = 320 + i * TALENT_OFFSET_X
    canvas2d.draw({
      image: await getTalent(talentPokemonPlayer2),
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

const getTalents = (playerData: any) => {
  const talents: (string | undefined)[] = []
  for (let i = 1; i <= 9; i++) {
    const talent = talentIdMap.get(playerData.teamPoke1[`talentId${i}`])
    talents.push(talent)
  }
  return talents
}
