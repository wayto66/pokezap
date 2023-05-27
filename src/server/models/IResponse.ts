export type IResponse = {
  status: number
  message: string
  data: any
  imageUrl?: string
  actions?: string[]
  react?: string
  afterMessage?: string
  afterMessageActions?: string[]
  isAnimated?: boolean
}
