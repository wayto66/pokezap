const daycareLevelBonusesMap = new Map<
  number,
  { slots: number; hoursForLevel: number; percentageOfRouteLevel: number }
>([
  [
    1,
    {
      hoursForLevel: 24,
      slots: 8,
      percentageOfRouteLevel: 0.5,
    },
  ],
  [
    2,
    {
      hoursForLevel: 22,
      slots: 12,
      percentageOfRouteLevel: 0.6,
    },
  ],
  [
    3,
    {
      hoursForLevel: 20,
      slots: 15,
      percentageOfRouteLevel: 0.7,
    },
  ],
  [
    4,
    {
      hoursForLevel: 18,
      slots: 17,
      percentageOfRouteLevel: 0.8,
    },
  ],
  [
    5,
    {
      hoursForLevel: 16,
      slots: 20,
      percentageOfRouteLevel: 0.9,
    },
  ],
])

const barcoLevelBonusesMap = new Map<number, { travelHoursDuration: number; travelCooldownHours: number }>([
  [
    1,
    {
      travelHoursDuration: 0.5,
      travelCooldownHours: 12,
    },
  ],
  [
    2,
    {
      travelHoursDuration: 1,
      travelCooldownHours: 8,
    },
  ],
  [
    3,
    {
      travelHoursDuration: 1.5,
      travelCooldownHours: 5,
    },
  ],
  [
    4,
    {
      travelHoursDuration: 2,
      travelCooldownHours: 2,
    },
  ],
  [
    5,
    {
      travelHoursDuration: 3,
      travelCooldownHours: 0.5,
    },
  ],
])

const pokemonCenterLevelBonusesMap = new Map<number, { bonusEnergy: number }>([
  [
    1,
    {
      bonusEnergy: 1,
    },
  ],
  [
    2,
    {
      bonusEnergy: 2,
    },
  ],
  [
    3,
    {
      bonusEnergy: 3,
    },
  ],
  [
    4,
    {
      bonusEnergy: 4,
    },
  ],
  [
    5,
    {
      bonusEnergy: 5,
    },
  ],
])

const pokeranchLevelBonusesMap = new Map<number, { hoursLimit: number; hoursCooldown: number }>([
  [
    1,
    {
      hoursLimit: 6,
      hoursCooldown: 2,
    },
  ],
  [
    2,
    {
      hoursLimit: 9,
      hoursCooldown: 1,
    },
  ],
  [
    3,
    {
      hoursLimit: 12,
      hoursCooldown: 0.5,
    },
  ],
  [
    4,
    {
      hoursLimit: 16,
      hoursCooldown: 0.5,
    },
  ],
  [
    5,
    {
      hoursLimit: 24,
      hoursCooldown: 0.5,
    },
  ],
])

export const routeUpgradesLevelUpBonusesMap = new Map<string, Map<number, any>>([
  ['daycare', daycareLevelBonusesMap],
  ['barco', barcoLevelBonusesMap],
  ['poke-center', pokemonCenterLevelBonusesMap],
  ['poke-ranch', pokeranchLevelBonusesMap],
])
