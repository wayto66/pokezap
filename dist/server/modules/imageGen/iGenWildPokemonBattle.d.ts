import { BasePokemon, Pokemon } from '@prisma/client';
type duelPokemon = Pokemon & {
    baseData: BasePokemon;
    skillName: string;
    skillType: string;
    ultimateType: string;
};
type TDuelRoundData = {
    winnerPokemon: duelPokemon;
    loserPokemon: duelPokemon;
    roundCount: number;
    duelMap: Map<number, any>;
    winnerDataName: string;
    loserDataName: string;
};
export declare const iGenWildPokemonBattle: (data: TDuelRoundData) => Promise<string>;
export {};
