type TGetPokemonRequestData = {
  searchMode: string
  pokemonId: number
  pokemonIdentifierString: string
  playerId: number
  onlyAdult?: boolean
}

export const getPokemonRequestData = ({
  searchMode,
  pokemonId,
  pokemonIdentifierString,
  playerId,
  onlyAdult,
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
          baseData: {
            name: pokemonIdentifierString.toLowerCase(),
          },
          ownerId: playerId,
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
        baseData: {
          name: pokemonIdentifierString.toLowerCase(),
        },
        ownerId: playerId,
      },
    }
}
