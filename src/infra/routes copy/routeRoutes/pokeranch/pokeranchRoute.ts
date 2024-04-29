import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { getHoursDifference } from '../../../../server/helpers/getHoursDifference'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import { iGenWildPokemon } from '../../../../server/modules/imageGen/iGenWildPokemon'
import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonExceededRanchTimeLimit,
  PokemonNotFoundError,
  RouteDoesNotHaveUpgradeError,
  RouteNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokeranchRoute = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  const searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (isNaN(pokemonId)) throw new TypeMissmatchError(pokemonIdString, 'número')

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      teamPoke1: true,
      teamPoke2: true,
      teamPoke3: true,
      teamPoke4: true,
      teamPoke5: true,
      teamPoke6: true,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const route = await prismaClient.gameRoom.findFirst({
    where: {
      phone: data.groupCode,
    },
    include: {
      activeWildPokemon: true,
      upgrades: {
        include: {
          base: true,
        },
      },
    },
  })

  if (!route) throw new RouteNotFoundError(player.name, data.groupCode)
  if (!route.upgrades.map(upg => upg.base.name).includes('poke-ranch'))
    throw new RouteDoesNotHaveUpgradeError('poke-ranch')

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prismaClient.pokemon.findFirst({
    where: {
      id: pokemonId,
      gameRoomId: route.id,
      savage: true,
      owner: undefined,
      ownerId: undefined,
    },
    include: {
      baseData: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  const hoursDiff = getHoursDifference(pokemon.createdAt, new Date())
  if (hoursDiff > 12) throw new PokemonExceededRanchTimeLimit(pokemon.id, pokemon.baseData.name)

  const imageUrl = await iGenWildPokemon({
    pokemon,
  })

  const displayName = pokemon.isShiny ? `shiny ${pokemon.baseData.name}` : `${pokemon.baseData.name}`

  return {
    message: `*${player.name}* acaba de encontrar *#${pokemon.id} ${displayName}* no poke-ranch!
Ações:
👍 - Batalha Rápida
`,
    status: 200,
    imageUrl,
    actions: [`pz. battle ${pokemon.id} fast`],
  }
}
