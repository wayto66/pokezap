import prisma from '../../../../../prisma-provider/src'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import {
  CantProceedWithPokemonInTeamError,
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerInRaidIsLockedError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  TypeMissmatchError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const sendPoke = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, targetPlayerIdString] = data.routeParams

  if (!pokemonIdString) throw new MissingParameterError('id do pokemon à ser trocado')
  if (!targetPlayerIdString) throw new MissingParameterError('id do jogador que irá receber o pokemon')

  const targetPlayerId = Number(targetPlayerIdString)
  if (isNaN(targetPlayerId)) throw new TypeMissmatchError(targetPlayerIdString, 'número')

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: true,
      talent1: true,
      talent2: true,
      talent3: true,
      talent4: true,
      talent5: true,
      talent6: true,
      talent7: true,
      talent8: true,
      talent9: true,
      owner: true,
      heldItem: {
        include: {
          baseItem: true,
        },
      },
      teamSlot1: true,
      teamSlot2: true,
      teamSlot3: true,
      teamSlot4: true,
      teamSlot5: true,
      teamSlot6: true,
    },
  })
  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemonIdString, player.name)
  if (
    pokemon.teamSlot1 ||
    pokemon.teamSlot2 ||
    pokemon.teamSlot3 ||
    pokemon.teamSlot4 ||
    pokemon.teamSlot5 ||
    pokemon.teamSlot6
  )
    throw new CantProceedWithPokemonInTeamError(pokemon.id, pokemon.baseData.name)

  const targetPlayer = await prisma.player.findFirst({
    where: {
      id: targetPlayerId,
    },
  })

  if (!targetPlayer) throw new PlayerNotFoundError(targetPlayerIdString)
  if (pokemon.ownerId === targetPlayer.id) throw new UnexpectedError('sendPoke')
  if (targetPlayer.isInRaid) throw new PlayerInRaidIsLockedError(targetPlayer.name)

  await prisma.$transaction([
    prisma.marketOffer.updateMany({
      where: {
        OR: [
          {
            pokemonDemand: {
              some: {
                id: pokemon.id,
              },
            },
          },
          {
            pokemonOffer: {
              some: {
                id: pokemon.id,
              },
            },
          },
        ],
      },
      data: {
        active: false,
      },
    }),
    prisma.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        ownerId: targetPlayer.id,
      },
      include: {
        baseData: true,
      },
    }),
  ])

  return {
    message: `*${player.name}* enviou #${pokemon.id} para *${targetPlayer.name}*.`,
    status: 200,
    data: null,
  }
}
