import prisma from '../../../../../prisma-provider/src'
import { IResponse } from '../../../server/models/IResponse'
import { MissingParameterError, SkillNotFoundError } from '../../errors/AppErrors'
import { TRouteParams } from '../router'

export const helpSkill = async (data: TRouteParams): Promise<IResponse> => {
  const [, , , skillNameUppercase] = data.routeParams
  if (!skillNameUppercase) throw new MissingParameterError('Nome da skill')

  const skillName = skillNameUppercase.toLowerCase()

  const skill = await prisma.skill.findFirst({
    where: {
      name: skillName,
    },
  })

  if (!skill) throw new SkillNotFoundError(skillName)

  return {
    message: `Informações da skill: *${skill.name.toUpperCase()}*: \n\nPOWER: ${skill.attackPower} -------- ACURACCY: ${
      skill.accuracy
    } \nPP: ${skill.pp} -------- TIPO: ${skill.typeName}\nCLASSE: ${skill.class} -------- CATEGORIA: ${
      skill.category
    } \n\n ${skill.description}`,
    status: 200,
    data: null,
  }
}
