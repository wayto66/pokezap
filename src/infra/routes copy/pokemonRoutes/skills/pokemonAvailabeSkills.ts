import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonAvailabeSkills = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')
  const [, , , pokemonIdString] = data.routeParams
  if (!pokemonIdString) throw new MissingParametersPokemonInformationError()

  let searchMode = 'string'

  const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1))
  if (!isNaN(pokemonId)) searchMode = 'number'

  const player = await prismaClient.player.findFirst({
    where: {
      phone: data.playerPhone,
    },
  })
  if (!player) throw new PlayerNotFoundError(data.playerPhone)

  const basePokemonNamesPre = await prismaClient.basePokemon.findMany({
    select: {
      name: true,
    },
  })

  const basePokemonNames = basePokemonNamesPre.map(p => p.name)

  const pokemonRequestData = getPokemonRequestData({
    playerId: player.id,
    pokemonId: pokemonId,
    pokemonIdentifierString: pokemonIdString,
    searchMode,
    includeNotOwned: !basePokemonNames.includes(pokemonIdString.toLowerCase()),
  })
  if (!pokemonRequestData) throw new UnexpectedError('NO REQUEST DATA FOUND.')

  const pokemon = await prismaClient.pokemon.findFirst({
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
      skills: true,
    },
  })
  if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
    throw new PokemonNotFoundError(pokemonRequestData.identifier)

  const skillTable = pokemon.baseData.skillTable
  const skillMap = new Map<string, string>([])

  for (const skill of skillTable) {
    const split = skill.split('%')
    skillMap.set(split[0], split[1])
  }

  const skills = pokemon.skills

  const skillDisplays: string[] = []

  for (const skill of skills) {
    const skillLevel = skillMap.get(skill.name)
    if (Number(skillLevel) > pokemon.level) continue
    const skillDisplay = `*${skill.name}* - PODER: ${skill.attackPower} - TIPO: ${skill.typeName}\n `
    skillDisplays.push(skillDisplay)
  }

  return {
    message: `Habilidades disponíveis para ${(
      pokemon.nickName ?? pokemon.baseData.name
    ).toUpperCase()}: \n\n${skillDisplays.join('\n')}`,
    status: 200,
    data: null,
  }
}
