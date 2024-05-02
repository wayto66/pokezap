import { Player } from '@prisma/client'

export type TQuestCheckData = {
  player: Player
  requestedElement: string
  requestedAmount: number
}

export type TQuestCheckResponse = {
  done: boolean
  remaining?: number
}

export const questCheck = async ({
  player,
  requestedAmount,
  requestedElement,
}: TQuestCheckData): Promise<TQuestCheckResponse> => {
  const today = new Date() // Get the current date
  today.setHours(0, 0, 0, 0) // Set the time to midnight

  const pokemonsDefeatedToday = await prisma.pokemon.findMany({
    where: {
      createdAt: {
        gte: today, // Filter for records created on or after today
      },
      defeatedBy: {
        some: {
          id: player.id,
        },
      },
      baseData: {
        OR: [{ type1Name: requestedElement }, { type2Name: requestedElement }],
      },
    },
  })

  const defeatedAmount = pokemonsDefeatedToday.length || 0

  if (defeatedAmount >= requestedAmount)
    return {
      done: true,
    }

  return {
    done: false,
    remaining: requestedAmount - defeatedAmount,
  }
}
