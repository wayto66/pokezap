export interface IPokemon {
  id: number
  ownerId?: number | null
  basePokemonId: number
  gameRoomId?: number | null
  nickname?: string | null

  savage: boolean
  level: number

  hp: number
  atk: number
  def: number
  spAtk: number
  spDef: number
  speed: number

  isAdult: boolean

  talentId1: number
  talentId2: number
  talentId3: number
  talentId4: number
  talentId5: number
  talentId6: number
  talentId7: number
  talentId8: number
  talentId9: number

  parentId1: number | null
  parentId2: number | null
  childrenId1: number | null
  childrenId2: number | null
  childrenId3: number | null
  childrenId4: number | null

  baseData: any | null | undefined

  statusTrashed: boolean
  createdAt: Date
  updatedAt: Date
}
