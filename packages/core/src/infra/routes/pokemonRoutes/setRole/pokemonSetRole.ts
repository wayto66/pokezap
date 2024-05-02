import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import {
  MissingParameterError,
  MissingParameterSetRoleRouteError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonSetRole = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, roleUppercase] = data.routeParams
  if (!pokemonIdString) throw new MissingParameterError('Nome/Id do Pokemon e nome do Item')

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    onlyAdult: true,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prisma.pokemon.findFirst({
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
  if (!pokemon || !pokemon.isAdult) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)

  if (!roleUppercase) throw new MissingParameterSetRoleRouteError(pokemon.nickName ?? pokemon.baseData.name)

  const role = roleUppercase.toLowerCase()
  if (!['damage', 'tanker', 'support'].includes(role)) throw new UnexpectedError('invalid role')

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      role: roleUppercase,
    },
  })

  return {
    message: `#${pokemon.id} ${
      pokemon.nickName?.toUpperCase() ?? pokemon.baseData.name.toUpperCase()
    } foi atribuido à função *${roleUppercase}*`,
    status: 200,
    data: null,
  }
}
