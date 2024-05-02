export interface ISession {
  id: number
  mode: string

  invitedId: number
  creatorId: number

  isInProgress: boolean
  isFinished: boolean

  statusTrashed: boolean
}
