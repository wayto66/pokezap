type TGetPokemonRequestData = {
  searchMode: string
  pokemonId: number
  pokemonIdentifierString: string
  playerId: number
  onlyAdult?: boolean
  includeNotOwned?: boolean
}

export const getPokemonRequestData = ({
  searchMode,
  pokemonId,
  pokemonIdentifierString,
  playerId,
  onlyAdult,
  includeNotOwned,
}: TGetPokemonRequestData) => {
  if (onlyAdult) {
    if (searchMode === 'number')
      return {
        identifier: pokemonId,
        where: {
          id: pokemonId,
          isAdult: true,
        },
      }
    if (searchMode === 'string')
      return {
        identifier: pokemonIdentifierString.toLowerCase(),
        where: {
          OR: [
            {
              baseData: {
                name: pokemonIdentifierString.toLowerCase(),
              },
            },
            {
              nickName: pokemonIdentifierString.toLowerCase(),
            },
          ],
          ownerId: includeNotOwned ? undefined : playerId,
          isAdult: true,
        },
      }
  }
  if (searchMode === 'number')
    return {
      identifier: pokemonId,
      where: {
        id: pokemonId,
      },
    }
  if (searchMode === 'string')
    return {
      identifier: pokemonIdentifierString.toLowerCase(),
      where: {
        OR: [
          {
            baseData: {
              name: pokemonIdentifierString.toLowerCase(),
            },
          },
          {
            nickName: pokemonIdentifierString.toLowerCase(),
          },
        ],
        ownerId: includeNotOwned ? undefined : playerId,
      },
    }
}
