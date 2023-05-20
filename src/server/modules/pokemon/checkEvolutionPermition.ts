import { PrismaClient } from '@prisma/client'
import { container } from 'tsyringe'

type TParams = {
  pokemonId: number
  playerPhone: string
}

export const checkEvolutionPermition = async (data: TParams) => {
  const client = container.resolve<PrismaClient>('PrismaClient')

  const poke = await client.pokemon.findFirst({
    where: {
      id: data.pokemonId,
      owner: {
        phone: data.playerPhone,
      },
    },
    include: {
      baseData: true,
    },
  })

  if (!poke) return null

  const fullData: any = poke.baseData.evolutionData
  const evData = fullData.evolutionChain[0]

  if (!evData) return

  const getCurrentPosition = () => {
    if (poke.baseData.isFirstEvolution) return 0
    if (poke.baseData.name === evData?.species?.name) return 1
    if (poke.baseData.name === evData?.evolves_to[0]?.species?.name) return 2

    return -1
  }

  const currentPosition = getCurrentPosition()

  if (currentPosition === 2) return

  if (currentPosition === -1) {
    return {
      message: 'ERROR: Could not get the current position of your pokemon in the evolution chain.',
      status: 400,
      data: null,
    }
  }

  let evoData: any = null

  if (currentPosition === 0) evoData = evData
  if (currentPosition === 1) evoData = evData.evolves_to[0]

  if (evoData === null) {
    console.log('evoData is null. currentPosition out of [-1,0,1,2]')
    return
  }

  const evoTrigger = evoData.evolution_details[0].trigger
  if (evoTrigger.name !== 'level-up') {
    return {
      message: 'ERROR: Only evolution method allowed at this moment is level-up.',
      status: 400,
      data: null,
    }
  }

  if (poke.level < evoData.evolution_details[0].min_level)
    return {
      message: `DUMMY: Insufficient level. Necessary: ${evoData.evolution_details[0].min_level}, current: ${poke.level}`,
      status: 300,
      data: null,
    }

  const evoToPoke = await client.basePokemon.findFirst({
    where: {
      name: evoData.species.name,
    },
  })

  if (!evoToPoke)
    return {
      message: `ERROR: No BasePokemon found with name '${evoData.species.name}`,
      status: 400,
      data: null,
    }

  const evolvedPoke = await client.pokemon.update({
    where: {
      id: data.pokemonId,
    },
    data: {
      baseData: {
        connect: {
          id: evoToPoke.id,
        },
      },
    },
    include: {
      baseData: true,
    },
  })
  console.log(`${poke.baseData.name} evolved to ${evolvedPoke.baseData.name}`)
}
