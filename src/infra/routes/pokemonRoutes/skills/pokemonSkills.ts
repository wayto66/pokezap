import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'
import { TRouteParams } from '../../../../infra/routes/router'
import { IResponse } from '../../../../server/models/IResponse'
import { MissingParameterError, PokemonNotFoundError, UnexpectedError } from '../../../errors/AppErrors'
import { pokemonSkillsByRole } from './pokemonSkillsByRole'

export const pokemonSkills = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , element, pokemonName] = data.routeParams
  if (!element) throw new MissingParameterError('elemento de ataque')
  if (!pokemonName) throw new MissingParameterError('nome do pokemon')

  let mode = 'type'

  const type = await prismaClient.type.findFirst({
    where: {
      name: element.toLowerCase(),
    },
  })

  if (!type) {
    if (['TANKER', 'SUPPORT', 'DAMAGE'].includes(element)) {
      return await pokemonSkillsByRole(data)
    } else {
      throw new UnexpectedError(`Tipo "${element}" não é um tipo válido.`)
    }
  }

  const pokemon = await prismaClient.basePokemon.findFirst({
    where: {
      name: pokemonName.toLowerCase(),
    },
    include: {
      skills: {
        where: {
          typeName: type.name,
        },
      },
    },
  })
  if (!pokemon) throw new PokemonNotFoundError(pokemonName)

  const skillTable = pokemon.skillTable
  const skillMap = new Map<string, string>([])

  for (const skill of skillTable) {
    const split = skill.split('%')
    skillMap.set(split[0], split[1])
  }

  const skills = pokemon.skills

  const skillDisplays: string[] = []

  for (const skill of skills) {
    const skillLevel = skillMap.get(skill.name)
    const skillDisplay = `*${skill.name}* -PWR:${skill.attackPower} -LVL:${skillLevel}-CLASSE:${skill.class}\n `
    skillDisplays.push(skillDisplay)
  }

  return {
    message: `SKILLS DO TIPO ${type.name.toUpperCase()} para ${pokemonName.toUpperCase()}: \n\n${skillDisplays}`,
    status: 200,
    data: null,
  }
}
