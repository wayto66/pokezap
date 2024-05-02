export class UserDemandHandler {
  private userDemandMap = new Map<string, number>()

  public get(user: string) {
    return this.userDemandMap.get(user)
  }

  public set(user: string, value: number) {
    return this.userDemandMap.set(user, value)
  }

  public add(user: string, value: number) {
    const demand = this.get(user)
    if (!demand) {
      return this.set(user, value)
    }
    return this.set(user, demand + value)
  }

  public reduce(user: string, value: number) {
    const demand = this.get(user)
    if (!demand) {
      return this.set(user, 0)
    }
    return this.set(user, demand - value)
  }
}
