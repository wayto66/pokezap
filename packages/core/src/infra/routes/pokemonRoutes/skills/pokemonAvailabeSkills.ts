import { getPokemonRequestData } from '../../../../server/helpers/getPokemonRequestData'
import { IResponse } from '../../../../server/models/IResponse'
import { verifyTalentPermission } from '../../../../server/modules/duel/duelNXN'
import {
  MissingParametersPokemonInformationError,
  PlayerNotFoundError,
  PokemonNotFoundError,
  UnexpectedError,
} from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonAvailabeSkills = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , pokemonIdString, all] = data.routeParams
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

  const basePokemonNamesPre = await prisma.basePokemon.findMany({
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

  const pokemon = await prisma.pokemon.findFirst({
    where: pokemonRequestData.where,
    include: {
      baseData: {
        include: {
          skills: true,
        },
      },
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

  const skills = pokemon.baseData.skills.sort((a, b) => a.name.localeCompare(b.name))

  const skillDisplays: string[] = []

  for (const skill of skills) {
    if (skill.attackPower === 0 && all !== 'ALL') continue
    const skillLevel = Number(skillMap.get(skill.name) ?? '0')
    if (skillLevel !== 999 && skillLevel > pokemon.level) continue
    if (skillLevel === 999 && pokemon.TMs < 3) continue
    const permit = verifyTalentPermission(pokemon, skill)
    if (!permit.permit) continue
    const skillDisplay = `${skillLevel === 999 ? '[tm] ' : ''}*${skill.name}* - PODER: *${
      skill.attackPower
    }* - TIPO: *${skill.typeName}*`
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
