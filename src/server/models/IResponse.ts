export type IResponse = {
  status: number
  message: string
  data: any
  imageUrl?: string
  actions?: any[]
  react?: any
  afterMessage?: string
  isAnimated?: boolean
}
