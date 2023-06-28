import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { talentIdMap } from '../../../../server/constants/talentIdMap'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenInventoryPokemons } from '../../../../server/modules/imageGen/iGenInventoryPokemons'

export const inventoryPokemons1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pageOrFilter, ...filteredOptions] = data.routeParams

  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: {
        include: {
          baseData: true,
        },
      },
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const page = !isNaN(Number(pageOrFilter)) ? Number(pageOrFilter) : 1
  const filter = pageOrFilter !== undefined ? pageOrFilter.toUpperCase() : ''

  const isFilteredByEggs = ['EGGS', 'EGG', 'OVO', 'OVOS'].includes(filter)
  const isFilteredByTalents = ['TALENT', 'TALENTS', 'TALENTO', 'TALENTOS'].includes(filter)
  const isFilteredByNames = ['NAME', 'NAMES', 'NOME', 'NOMES'].includes(filter)
  const isFilteredByTypes = ['TYPE', 'TYPES', 'TIPO', 'TIPOS'].includes(filter)

  let baseData: any
  let filteredNumbers: number[] = []

  function getTalentNumber(talent: string): number | undefined {
    for (const [number, value] of talentIdMap.entries()) {
      if (value === talent) {
        return number
      }
    }
    return undefined
  }

  if (isFilteredByTypes) {
    baseData = {
      OR: [{ type1Name: { in: filteredOptions } }, { type2Name: { in: filteredOptions } }],
    }
  } else if (isFilteredByNames) {
    baseData = {
      OR: filteredOptions.map(option => ({ name: { contains: option } })),
    }
  } else if (isFilteredByTalents) {
    filteredNumbers = filteredOptions
      .map((option: string) => getTalentNumber(option))
      .filter((number): number is number => number !== null)
  }

  const pokemons = await prismaClient.pokemon.findMany({
    where: {
      ownerId: player.id,
      isAdult: !isFilteredByEggs,
      isInDaycare: false,
      baseData,
      OR:
        filteredNumbers.length > 0
          ? filteredNumbers.map(number => ({
              OR: [
                { talentId1: number },
                { talentId2: number },
                { talentId3: number },
                { talentId4: number },
                { talentId5: number },
                { talentId6: number },
                { talentId7: number },
                { talentId8: number },
                { talentId9: number },
              ],
            }))
          : undefined,
    },
    skip: Math.max(0, (page - 1) * 20),
    take: 20,
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  function getTalentCount(pokemon: any): number {
    let count = 0
    for (let i = 1; i <= 9; i++) {
      const talentId = pokemon[`talentId${i}`]
      if (talentId && filteredNumbers.length > 0 && filteredNumbers.includes(talentId)) {
        count++
      }
    }
    return count
  }

  pokemons.sort((a, b) => {
    const aTalentCount = getTalentCount(a)
    const bTalentCount = getTalentCount(b)

    return bTalentCount - aTalentCount
  })

  const imageUrl = await iGenInventoryPokemons({
    pokemons,
  })

  return {
    message: `Página ${page} de Pokemons de ${player.name}.
    👍 - Próxima página`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pz. inventory poke ${page + 1}`],
  }
}
