export interface IPlayer {
    id: number;
    phone: string;
    name: string;
    nickname?: string | null;
    elo: number;
    cash: number;
}
