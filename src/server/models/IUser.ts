export interface IUser {
  id: number
  playerPhone: string
  name: string
  nickname?: string | null
  elo: number
  cash: number
}
