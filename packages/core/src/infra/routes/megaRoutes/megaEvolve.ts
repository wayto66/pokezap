import prisma from '../../../../../prisma-provider/src'
import { megaPokemonNames } from '../../../server/constants/megaPokemonNames'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import { generateGeneralStats } from '../../../server/modules/pokemon/generateGeneralStats'
import { generateHpStat } from '../../../server/modules/pokemon/generateHpStat'
import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonCantMegaEvolveError,
  PokemonIsNotHoldingItemError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const megaEvolve = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

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
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      heldItem: {
        include: {
          baseItem: true,
        },
      },
      baseData: true,
    },
    orderBy: {
      level: 'desc',
    },
  })
  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)
  if (!megaPokemonNames.includes(pokemon.baseData.name)) throw new PokemonCantMegaEvolveError(pokemon.id)

  const megaEvolution = await prisma.basePokemon.findFirst({
    where: {
      name: pokemon.baseData.name + '-mega',
    },
  })

  if (!megaEvolution) throw new PokemonNotFoundError(pokemon.baseData.name + '-mega')

  const requiredItemName = megaEvolution.megaEvolutionItemName

  if (!requiredItemName) throw new UnexpectedError('não foi possivel obter o nome da mega-stone.')

  if (pokemon.heldItem?.baseItem.name !== requiredItemName)
    throw new PokemonIsNotHoldingItemError(pokemon.baseData.name)

  const shinyMultiper = pokemon.isShiny ? 1.15 : 1
  const bossMultiplier = 1

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      basePokemonId: megaEvolution.id,
      spriteUrl: pokemon.isShiny ? megaEvolution.shinySpriteUrl : megaEvolution.defaultSpriteUrl,
      hp: Math.round(generateHpStat(megaEvolution.BaseHp, pokemon.level) * shinyMultiper * bossMultiplier),
      atk: Math.round(generateGeneralStats(megaEvolution.BaseAtk, pokemon.level) * shinyMultiper * bossMultiplier),
      def: Math.round(generateGeneralStats(megaEvolution.BaseDef, pokemon.level) * shinyMultiper * bossMultiplier),
      spAtk: Math.round(generateGeneralStats(megaEvolution.BaseSpAtk, pokemon.level) * shinyMultiper * bossMultiplier),
      spDef: Math.round(generateGeneralStats(megaEvolution.BaseSpDef, pokemon.level) * shinyMultiper * bossMultiplier),
      speed: Math.round(generateGeneralStats(megaEvolution.BaseSpeed, pokemon.level) * shinyMultiper * bossMultiplier),
    },
  })

  return {
    message: '',
    react: '👌',
    status: 200,
  }
}
