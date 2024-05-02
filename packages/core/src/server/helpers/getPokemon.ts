import { PrismaClient } from '@prisma/client'
import { UnexpectedError } from '../../infra/errors/AppErrors'
import { PokemonBaseData } from '../modules/duel/duelNXN'
import { getPokemonRequestData } from './getPokemonRequestData'

export const getPokemon = async (
  prismaClient: PrismaClient,
  pokemonIdString: string,
  playerId: number
): Promise<PokemonBaseData | null> => {
  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const pokemonRequestData = getPokemonRequestData({
    playerId,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    onlyAdult: true,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  return await prismaClient.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
      owner: true,
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })
}
