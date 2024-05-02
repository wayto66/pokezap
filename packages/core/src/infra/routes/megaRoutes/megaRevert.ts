import prisma from '../../../../../prisma-provider/src'
import { getPokemonRequestData } from '../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../server/models/IResponse'
import { generateGeneralStats } from '../../../server/modules/pokemon/generateGeneralStats'
import { generateHpStat } from '../../../server/modules/pokemon/generateHpStat'
import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonIsNotMegaError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const megaRevert = async (data: TRouteParams): Promise<IResponse> => {
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
  if (!pokemon.baseData.name.includes('-mega')) throw new PokemonIsNotMegaError(pokemon.id)

  const normalForm = await prisma.basePokemon.findFirst({
    where: {
      name: pokemon.baseData.name.replace('-mega', ''),
    },
  })

  if (!normalForm) throw new PokemonNotFoundError(pokemon.baseData.name.replace('-mega', ''))

  const shinyMultiper = pokemon.isShiny ? 1.15 : 1
  const bossMultiplier = 1

  await prisma.pokemon.update({
    where: {
      id: pokemon.id,
    },
    data: {
      basePokemonId: normalForm.id,
      spriteUrl: pokemon.isShiny ? normalForm.shinySpriteUrl : normalForm.defaultSpriteUrl,
      hp: Math.round(generateHpStat(normalForm.BaseHp, pokemon.level) * shinyMultiper * bossMultiplier),
      atk: Math.round(generateGeneralStats(normalForm.BaseAtk, pokemon.level) * shinyMultiper * bossMultiplier),
      def: Math.round(generateGeneralStats(normalForm.BaseDef, pokemon.level) * shinyMultiper * bossMultiplier),
      spAtk: Math.round(generateGeneralStats(normalForm.BaseSpAtk, pokemon.level) * shinyMultiper * bossMultiplier),
      spDef: Math.round(generateGeneralStats(normalForm.BaseSpDef, pokemon.level) * shinyMultiper * bossMultiplier),
      speed: Math.round(generateGeneralStats(normalForm.BaseSpeed, pokemon.level) * shinyMultiper * bossMultiplier),
    },
  })

  return {
    message: '',
    react: '👌',
    status: 200,
  }
}
