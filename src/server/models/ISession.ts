export interface ISession {
  id: number
  mode: string

  isInProgress: boolean
  isFinished: boolean

  statusTrashed: boolean
}
