import { IPokemon } from './IPokemon'
import { IType } from './IType'

export interface ITalent {
  id: number
  typeName: string

  statusTrashed: boolean
  createdAt: Date
  updatedAt: Date

  type: IType
  pokemons: IPokemon[]
}
