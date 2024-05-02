import prisma from '../../../../../prisma-provider/src'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import {
  CantSellAllPokemonsError,
  CantSellPokemonInTeamError,
  MissingParameterError,
  PlayerDoestNotOwnThePokemonError,
  PlayerNotFoundError,
  UnexpectedError,
  ZeroPokemonsFoundError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const sellPokemon = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams

  const pokemonIdStrings = data.routeParams.slice(3)

  if (data.routeParams.length === 3) throw new MissingParameterError('Ids dos pokemons à serem vendidos.')

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
  if (player.ownedPokemons.length <= pokemonIdStrings.length) throw new CantSellAllPokemonsError(player.name)

  const pokemonRequestDatas: any[] = []

  for (const pokemonIdString of pokemonIdStrings) {
    if (pokemonIdString === 'CONFIRM') continue
    const pokemonRequestData = getPokemonRequestData({
      playerId: player.id,
      pokemonId: Number(pokemonIdString),
      pokemonIdentifierString: pokemonIdString,
      searchMode,
      onlyAdult: true,
    })
    if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')
    pokemonRequestDatas.push(pokemonRequestData)
  }

  const pokemons = await prisma.pokemon.findMany({
    where: {
      OR: pokemonRequestDatas.map(p => p.where),
    },
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
  if (pokemons.length === 0) throw new ZeroPokemonsFoundError()

  let totalCash = 0

  for (const pokemon of pokemons) {
    if (pokemon.ownerId !== player.id) throw new PlayerDoestNotOwnThePokemonError(pokemon.id, player.name)
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

    totalCash += pokemonSellPrice
  }

  if (data.fromReact && data.routeParams[data.routeParams.length - 1] === 'CONFIRM') {
    await prisma.pokemon.updateMany({
      where: {
        id: {
          in: pokemons.map(p => p.id),
        },
      },
      data: {
        ownerId: null,
        gameRoomId: null,
        statusTrashed: true,
      },
    })

    await prisma.player.update({
      where: {
        id: player.id,
      },
      data: {
        cash: {
          increment: totalCash,
        },
      },
    })
    return {
      message: `${data.playerName} vendeu ${pokemons
        .map(poke => {
          return `#${poke.id} ${poke.baseData.name}`
        })
        .join(', ')} e obteve $${totalCash}.`,
      status: 200,
      data: null,
    }
  }

  return {
    message: `Deseja vender ${pokemons
      .map(poke => {
        return `#${poke.id} ${poke.baseData.name}`
      })
      .join(', ')} por $${totalCash}?
    👍 - CONFIRMAR`,
    status: 200,
    data: null,
    actions: [`pz. sell poke ${pokemons.map(poke => poke.id).join(' ')} confirm`],
  }
}
