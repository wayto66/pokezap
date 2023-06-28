import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { PlayerNotFoundError } from '../../../../infra/errors/AppErrors'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenInventoryPokemons } from '../../../../server/modules/imageGen/iGenInventoryPokemons'
import { pokemonTypes } from '../../../../server/constants/pokemonTypes'

export const inventoryPokemons1 = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pageOrFilter] = data.routeParams

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

  const numberPage = () => {
    if (!isNaN(Number(pageOrFilter))) return Number(pageOrFilter)
    return 1
  }

  const isFilteredByType = pageOrFilter !== undefined && pokemonTypes.includes(pageOrFilter?.toLowerCase())

  const pokemons = await prismaClient.pokemon.findMany({
    where: {
      ownerId: player.id,
      isAdult: ['OVO', 'EGG', 'EGGS', 'OVOS'].includes(pageOrFilter) ? true : undefined,
      isInDaycare: false,
      baseData: isFilteredByType
        ? {
            OR: [
              {
                type1Name: pokemonTypes.join(' ').includes(pageOrFilter?.toLowerCase())
                  ? pageOrFilter.toLowerCase()
                  : undefined,
              },
              {
                type2Name: pokemonTypes.join(' ').includes(pageOrFilter?.toLowerCase())
                  ? pageOrFilter.toLowerCase()
                  : undefined,
              },
            ],
          }
        : undefined,
    },
    skip: Math.max(0, (numberPage() - 1) * 20),
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

  const imageUrl = await iGenInventoryPokemons({
    pokemons,
  })

  return {
    message: `Página ${numberPage()} de Pokemons de ${player.name}.
    👍 - Próxima página`,
    status: 200,
    data: null,
    imageUrl: imageUrl,
    actions: [`pz. inventory poke ${numberPage() + 1}`],
  }
}
