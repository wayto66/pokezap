import { BasePokemon, Player, Pokemon } from '@prisma/client';
type DuelPokemon = Pokemon & {
    baseData: BasePokemon;
    skillName?: string | undefined;
    skillType?: string | undefined;
    ultimateType?: string | undefined;
};
type TParams = {
    team1: [DuelPokemon, DuelPokemon];
    team2: [DuelPokemon, DuelPokemon];
    player1?: Player;
    player2?: Player;
    againstWildPokemon?: boolean;
};
export type TDuelX2Response = {
    winnerTeam: any[] | null;
    loserTeam: any[] | null;
    message: string;
    isDraw: boolean;
    imageUrl: string;
};
export declare const duelX2: (data: TParams) => Promise<TDuelX2Response | void>;
export {};
