import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import {
  CantSellPokemonInTeamError,
  MissingParametersBuyAmountError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  PlayerOnlyHasOnePokemonError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonSell = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, confirm] = data.routeParams

  if (!pokemonIdString) throw new MissingParametersBuyAmountError()

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prisma.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
    include: {
      ownedPokemons: true,
    },
  })

  if (!player) throw new PlayerNotFoundError(data.playerPhone)
  if (player.ownedPokemons.length <= 1) throw new PlayerOnlyHasOnePokemonError(player.name)

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
      teamSlot1: true,
      teamSlot2: true,
      teamSlot3: true,
      teamSlot4: true,
      teamSlot5: true,
      teamSlot6: true,
      owner: true,
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemonId, player.name)
  if (
    pokemon.teamSlot1 ||
    pokemon.teamSlot2 ||
    pokemon.teamSlot3 ||
    pokemon.teamSlot4 ||
    pokemon.teamSlot5 ||
    pokemon.teamSlot6
  )
    throw new CantSellPokemonInTeamError(pokemon.id)

  const pokemonSellPrice = Math.floor(
    35 + (pokemon.level ** 2 / 150) * 100 + (pokemon.baseData.BaseExperience ** 2 / 1200) * 50
  )

  if (data.fromReact && confirm === 'CONFIRM') {
    await prisma.pokemon.update({
      where: {
        id: pokemon.id,
      },
      data: {
        owner: {
          disconnect: true,
        },
        gameRoom: {
          disconnect: true,
        },
        statusTrashed: true,
      },
    })

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          increment: pokemonSellPrice,
        },
      },
    })
    return {
      message: `${data.playerName} vendeu #${pokemon.id} ${pokemon.baseData.name} por $${pokemonSellPrice}.`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Deseja vender #${pokemon.id} ${pokemon.baseData.name} por $${pokemonSellPrice}?
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    actions: [`pz. poke sell ${pokemon.id} confirm`],
  }
}
