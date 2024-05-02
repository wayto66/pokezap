import prisma from '../../../../../prisma-provider/src'
import { PokemonBaseData } from '../../../types'
import { bossPokemonNames } from '../../constants/bossPokemonNames'
import { generateGeneralStats } from './generateGeneralStats'
import { generateHpStat } from './generateHpStat'

export const windPokeEvolve = async (
  poke: PokemonBaseData,
  maximumBaseExperience: number
): Promise<PokemonBaseData> => {
  const fullData: any = poke.baseData.evolutionData
  const evData = fullData.evolutionChain[0]

  if (!evData) return poke

  const getCurrentPosition = () => {
    if (poke.baseData.isFirstEvolution) return 0
    if (poke.baseData.name === evData?.species?.name) return 1
    if (poke.baseData.name === evData?.evolves_to[0]?.species?.name) return 2

    return -1
  }

  const currentPosition = getCurrentPosition()

  if (currentPosition === 2) return poke

  if (currentPosition === -1) return poke

  let evoData: any = null

  if (currentPosition === 0) evoData = evData
  if (currentPosition === 1) evoData = evData.evolves_to[0]

  if (evoData === null) return poke

  const evoTrigger = evoData?.evolution_details[0]?.trigger

  if (!evoTrigger) return poke

  const evoToPoke = await prisma.basePokemon.findFirst({
    where: {
      name: evoData.species.name,
    },
  })

  if (!evoToPoke) return poke
  if (evoToPoke.BaseExperience > maximumBaseExperience) return poke
  if (evoTrigger.name === 'level-up' && poke.level < (evoData.evolution_details[0].min_level || 15)) return poke
  if (bossPokemonNames.includes(evoToPoke.name)) return poke

  const evolvedPoke = poke.isShiny
    ? await prisma.pokemon.update({
        where: {
          id: poke.id,
        },
        data: {
          baseData: {
            connect: {
              id: evoToPoke.id,
            },
          },
          spriteUrl: evoToPoke.shinySpriteUrl,
          hp: Math.round(generateHpStat(evoToPoke.BaseHp, poke.level) * 1.1),
          atk: Math.round(generateGeneralStats(evoToPoke.BaseAtk, poke.level) * 1.1),
          def: Math.round(generateGeneralStats(evoToPoke.BaseDef, poke.level) * 1.1),
          spAtk: Math.round(generateGeneralStats(evoToPoke.BaseSpAtk, poke.level) * 1.1),
          spDef: Math.round(generateGeneralStats(evoToPoke.BaseSpDef, poke.level) * 1.1),
          speed: Math.round(generateGeneralStats(evoToPoke.BaseSpeed, poke.level) * 1.1),
        },
        include: {
          baseData: true,
        },
      })
    : await prisma.pokemon.update({
        where: {
          id: poke.id,
        },
        data: {
          baseData: {
            connect: {
              id: evoToPoke.id,
            },
          },
          spriteUrl: evoToPoke.defaultSpriteUrl,
          hp: generateHpStat(evoToPoke.BaseHp, poke.level),
          atk: generateGeneralStats(evoToPoke.BaseAtk, poke.level),
          def: generateGeneralStats(evoToPoke.BaseDef, poke.level),
          spAtk: generateGeneralStats(evoToPoke.BaseSpAtk, poke.level),
          spDef: generateGeneralStats(evoToPoke.BaseSpDef, poke.level),
          speed: generateGeneralStats(evoToPoke.BaseSpeed, poke.level),
        },
        include: {
          baseData: true,
        },
      })

  return evolvedPoke
}
