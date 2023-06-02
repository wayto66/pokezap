import { PrismaClient } from '@prisma/client'
import { TRouteParams } from 'infra/routes/router'
import { container } from 'tsyringe'
import { IResponse } from '../../../../server/models/IResponse'
import { MissingParameterError, PokemonNotFoundError, UnexpectedError } from '../../../errors/AppErrors'

export const pokemonSkills = async (data: TRouteParams): Promise<IResponse> => {
  const prismaClient = container.resolve<PrismaClient>('PrismaClient')

  const [, , , element, pokemonName] = data.routeParams
  if (!element) throw new MissingParameterError('elemento de ataque')
  if (!pokemonName) throw new MissingParameterError('nome do pokemon')

  const type = await prismaClient.type.findFirst({
    where: {
      name: element.toLowerCase(),
    },
  })

  if (!type) throw new UnexpectedError(`Tipo "${element}" não é um tipo válido.`)

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
    if (!skillLevel || skill.attackPower === 0) continue
    const skillDisplay = `${skill.typeName} - ${skill.name} - PWR:${skill.attackPower} - LVL:${skillLevel}
    `
    skillDisplays.push(skillDisplay)
  }

  return {
    message: `${skillDisplays}`,
    status: 200,
    data: null,
  }
}
