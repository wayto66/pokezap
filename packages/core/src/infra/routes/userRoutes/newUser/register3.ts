import { iGenPlayerAnalysis } from '../../../../../../image-generator/src/iGenPlayerAnalysis'
import prisma from '../../../../../../prisma-provider/src'
import { IResponse } from '../../../../server/models/IResponse'
import { generateGeneralStats } from '../../../../server/modules/pokemon/generateGeneralStats'
import { generateHpStat } from '../../../../server/modules/pokemon/generateHpStat'
import { GenderDoesNotExistError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const register3 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , genderPre, spriteId] = data.routeParams
  const gender = genderPre.toUpperCase()
  if (gender !== 'MENINO' && gender !== 'MENINA') throw new GenderDoesNotExistError(gender)

  const playerSprite = () => {
    if (gender === 'MENINO') return 'male/' + spriteId + '.png'
    if (gender === 'MENINA') return 'female/' + spriteId + '.png'
    return ''
  }

  const newPlayer = await prisma.player.create({
    data: {
      name: data.playerName,
      phone: data.playerPhone,
      spriteUrl: playerSprite(),
      cash: 3000,
    },
  })

  const basePokes = await prisma.basePokemon.findMany({
    where: {
      BaseExperience: {
        lt: 65,
      },
      isMega: false,
      isRegional: false,
    },
  })

  const basePoke = basePokes[Math.floor(Math.random() * basePokes.length)]

  const newPokemon = await prisma.pokemon.create({
    data: {
      basePokemonId: basePoke.id,
      isAdult: true,
      isMale: Math.random() > 0.5,
      ownerId: newPlayer.id,
      spriteUrl: basePoke.defaultSpriteUrl,
      isShiny: false,
      level: 1,
      hp: generateHpStat(basePoke.BaseHp, 1),
      atk: generateGeneralStats(basePoke.BaseAtk, 1),
      def: generateGeneralStats(basePoke.BaseDef, 1),
      spAtk: generateGeneralStats(basePoke.BaseSpAtk, 1),
      spDef: generateGeneralStats(basePoke.BaseSpDef, 1),
      speed: generateGeneralStats(basePoke.BaseSpeed, 1),
      savage: false,
      talentId1: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId2: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId3: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId4: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId5: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId6: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId7: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId8: Math.max(Math.ceil(Math.random() * 18), 1),
      talentId9: Math.max(Math.ceil(Math.random() * 18), 1),
    },
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
    },
  })

  const player = await prisma.player.update({
    where: {
      id: newPlayer.id,
    },
    data: {
      teamPokeId1: newPokemon.id,
    },
    include: {
      ownedItems: {
        include: {
          baseItem: true,
        },
      },
      ownedPokemons: {
        include: {
          baseData: true,
        },
      },
      teamPoke1: {
        include: {
          baseData: true,
        },
      },
      teamPoke2: {
        include: {
          baseData: true,
        },
      },
      teamPoke3: {
        include: {
          baseData: true,
        },
      },
      teamPoke4: {
        include: {
          baseData: true,
        },
      },
      teamPoke5: {
        include: {
          baseData: true,
        },
      },
      teamPoke6: {
        include: {
          baseData: true,
        },
      },
    },
  })

  const imageUrl = await iGenPlayerAnalysis({
    playerData: player,
  })

  return {
    message: `Bem vindo(a) ${newPlayer.name}! Parece que o professor Oak te deu um ${newPokemon.baseData.name} de presente!

    Ao sair do laboratório, você nota um movimento estranho no arbusto a frente... \n\n 👍 - Investigar
    `,
    status: 200,
    imageUrl: imageUrl,
    data: null,
    actions: ['pz. start 4 '],
  }
}
