import { Skill } from '@prisma/client'
import { checkIfSkillIsSupportSkill, checkIfSkillIsTankerSkill } from '../../../../server/helpers/getBestSkillSet'
import { IResponse } from '../../../../server/models/IResponse'
import { MissingParameterError, PokemonNotFoundError } from '../../../errors/AppErrors'
import { TRouteParams } from '../../router'

export const pokemonSkillsByRole = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , elementUppercase, pokemonName] = data.routeParams
  if (!elementUppercase) throw new MissingParameterError('função')
  if (!pokemonName) throw new MissingParameterError('nome do pokemon')

  const pokemon = await prisma.basePokemon.findFirst({
    where: {
      name: pokemonName.toLowerCase(),
    },
    include: {
      skills: true,
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

  const getCheckFunction = () => {
    if (elementUppercase === 'TANKER') return checkIfSkillIsTankerSkill
    if (elementUppercase === 'SUPPORT') return checkIfSkillIsSupportSkill
    return (skill: Skill) => {
      return skill.attackPower > 0
    }
  }

  const checkFunction = getCheckFunction()

  for (const skill of skills) {
    if (!checkFunction(skill)) continue
    const skillLevel = skillMap.get(skill.name)
    const skillDisplay = `*${skill.name}* -PWR:${skill.attackPower} -LVL:${skillLevel}-CLASSE:${skill.class}`
    skillDisplays.push(skillDisplay)
  }

  return {
    message: `SKILLS DO TIPO ${elementUppercase} para ${pokemonName.toUpperCase()}: \n\n${skillDisplays.join('\n')}`,
    status: 200,
    data: null,
  }
}
