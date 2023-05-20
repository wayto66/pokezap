import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenPlayerAnalysis } from '../../../../server/modules/imageGen/iGenPlayerAnalysis'
import { generateGeneralStats } from '../../../../server/modules/pokemon/generateGeneralStats'
import { generateHpStat } from '../../../../server/modules/pokemon/generateHpStat'
import { TRouteParams } from '../../router'

export const newUser3 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , gender, spriteId] = data.routeParams
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  if (gender !== 'MENINO' && gender !== 'MENINA') {
    return {
      message: `ERRO: Gênero "${gender}" não encontrado. Utilize: 'menino' ou 'menina'.`,
      status: 400,
      data: null,
    }
  }

  const playerSprite = () => {
    if (gender === 'MENINO') return 'male/' + spriteId + '.png'
    if (gender === 'MENINA') return 'female/' + spriteId + '.png'
    return ''
  }

  const newPlayer = await prismaClient.player.create({
    data: {
      name: data.playerName,
      phone: data.playerPhone,
      spriteUrl: playerSprite(),
    },
  })

  const basePokes = await prismaClient.basePokemon.findMany({
    where: {
      BaseExperience: {
        lt: 65,
      },
    },
  })

  const basePoke = basePokes[Math.floor(Math.random() * basePokes.length)]

  const talents = await prismaClient.talent.findMany()

  const newPokemon = await prismaClient.pokemon.create({
    data: {
      basePokemonId: basePoke.id,
      isAdult: true,
      isMale: Math.random() > 0.5,
      ownerId: newPlayer.id,
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

  const player = await prismaClient.player.update({
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
      ownedHeldItems: true,
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
    message: `Usuário ${newPlayer.name} criado com o código ${newPlayer.phone}. Seu primeiro pokemon é um ${newPokemon.baseData.name}!`,
    status: 200,
    imageUrl: imageUrl,
    data: null,
  }
}
