/* eslint-disable array-callback-return */
import { iGenInventoryPokemons } from '../../../../../../image-generator/src/iGenInventoryPokemons'
import prisma from '../../../../../../prisma-provider/src'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { talentIdMap } from '../../../../server/constants/talentIdMap'
import { IResponse } from '../../../../server/models/IResponse'

export const inventoryPokemons1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pageOrFilter, ...filteredOptions] = data.routeParams

  const player = await prisma.player.findFirst({
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

  let page = 1
  if (!isNaN(Number(pageOrFilter))) page = Number(pageOrFilter)
  if (!isNaN(Number(filteredOptions[filteredOptions.length - 1])))
    page = Number(filteredOptions[filteredOptions.length - 1])

  const filter = pageOrFilter !== undefined ? pageOrFilter.toUpperCase() : ''

  const isFilteredByEggs = ['EGGS', 'EGG', 'OVO', 'OVOS'].includes(filter)
  const isFilteredByTalents = ['TALENT', 'TALENTS', 'TALENTO', 'TALENTOS'].includes(filter)
  const isFilteredByNames = ['NAME', 'NAMES', 'NOME', 'NOMES'].includes(filter)
  const isFilteredByTypes = ['TYPE', 'TYPES', 'TIPO', 'TIPOS'].includes(filter)

  let baseData: any
  let filteredNumbers: number[] = []

  function getTalentNumber(talent: string): number | undefined {
    for (const [number, talentName] of talentIdMap) {
      if (talentName === talent) {
        return number
      }
    }
    return undefined
  }

  const filteredOptionsLowerCase = filteredOptions
    .map(value => {
      const numberValue = Number(value)
      if (isNaN(numberValue)) return value.toLowerCase()
    })
    .filter(value => value !== undefined)

  if (isFilteredByTypes) {
    baseData = {
      OR: [{ type1Name: { in: filteredOptionsLowerCase } }, { type2Name: { in: filteredOptionsLowerCase } }],
    }
  } else if (isFilteredByNames) {
    baseData = {
      OR: filteredOptionsLowerCase.map(option => ({ name: { contains: option } })),
    }
  } else if (isFilteredByTalents) {
    filteredNumbers = filteredOptionsLowerCase
      .map((option: string | undefined) => {
        if (option) return getTalentNumber(option)
      })
      .filter((number): number is number => number !== null)
  }

  const pokemons = await prisma.pokemon.findMany({
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

  if (isFilteredByTalents) {
    pokemons.sort((a, b) => {
      const aTalentCount = getTalentCount(a)
      const bTalentCount = getTalentCount(b)

      return bTalentCount - aTalentCount
    })
  } else {
    pokemons.sort((a, b) => {
      return b.level - a.level
    })
  }

  const pokemonsTake20 = pokemons.slice(Math.max(0, (page - 1) * 20), Math.max(0, (page - 1) * 20) + 20)

  const imageUrl = await iGenInventoryPokemons({
    pokemons: pokemonsTake20,
  })

  const actions = [`pz. inventory poke ${pageOrFilter} ${filteredOptionsLowerCase} ${page + 1}`]

  return {
    message: `Página ${page} de Pokemons de ${player.name}.
    👍 - Próxima página`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions,
  }
}
