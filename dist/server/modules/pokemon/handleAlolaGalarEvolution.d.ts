import { BasePokemon } from '@prisma/client';
import { PokemonBaseData } from '../duel/duelNXN';
type TParams = {
    pokemon: PokemonBaseData;
    fromTrade?: boolean;
    currentRegion: string;
};
export declare const handleAlolaGalarEvolution: (data: TParams) => Promise<{
    evolved: boolean;
    pokemon?: PokemonBaseData | undefined;
    errorMessage?: string | undefined;
}>;
type TEvData = {
    trigger: {
        name: string;
        requires: string | number;
    };
    evolveTo: string | string[];
};
export declare const getRegionalEvolutionData: (baseData: BasePokemon) => TEvData | undefined;
export {};
