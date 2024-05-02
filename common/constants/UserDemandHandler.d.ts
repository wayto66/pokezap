export declare class UserDemandHandler {
    private userDemandMap;
    get(user: string): number | undefined;
    set(user: string, value: number): Map<string, number>;
    add(user: string, value: number): Map<string, number>;
    reduce(user: string, value: number): Map<string, number>;
}
