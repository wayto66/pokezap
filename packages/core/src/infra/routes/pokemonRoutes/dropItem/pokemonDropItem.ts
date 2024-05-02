import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import {
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonIsNotHoldingItemError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonDropItem = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParameterError('Nome/Id do Pokemon')

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
  if (!pokemon.heldItem) throw new PokemonIsNotHoldingItemError(pokemon.baseData.name)

  await prisma.item.upsert({
    create: {
      amount: 1,
      name: pokemon.heldItem.baseItem.name,
      ownerId: player.id,
    },
    update: {
      amount: {
        increment: 1,
      },
    },
    where: {
      ownerId_name: {
        ownerId: player.id,
        name: pokemon.heldItem.baseItem.name,
      },
    },
  })

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      heldItemId: null,
      heldItem: {
        disconnect: true,
      },
    },
    include: {
      baseData: true,
      heldItem: {
        include: {
          baseItem: true,
        },
      },
    },
  })

  return {
    message: ``,
    status: 200,
    react: '👌',
  }
}
