import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import {
  ItemNotFoundError,
  MissingParameterError,
  MissingParametersPokemonInformationError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'
import { IResponse } from '../../../../server/models/IResponse'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'

export const pokemonSetRole = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString, roleUppercase] = data.routeParams
  if (!pokemonIdString) throw new MissingParameterError('Nome/Id do Pokemon e nome do Item')
  if (!roleUppercase) throw new MissingParameterError('Role/Função desejada')
  const role = roleUppercase.toLowerCase()

  if (!['support', 'sup', 'suporte', 'tank', 'tanker', 'blocker', 'block', 'damage', 'dmg'].includes(role))
    throw new UnexpectedError('invalid role')

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prismaClient.player.findFirst({
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

  const pokemon = await prismaClient.pokemon.findFirst({
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

  return {
    message: `#${pokemon.id} ${pokemon.baseData.name.toUpperCase()} foi atribuido à função ${roleUppercase} !`,
    status: 200,
    data: null,
  }
}
