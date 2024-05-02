import { BasePokemon, Pokemon } from '@prisma/client';
import { RaidPokemonBaseData } from '../duel/duelNXN';
type TParams = {
    pokemon: Pokemon;
    targetPokemon: (Pokemon & {
        baseData: BasePokemon;
    }) | RaidPokemonBaseData;
    bonusExp?: number;
    divide?: boolean;
};
type TResponse = {
    pokemon: Pokemon & {
        baseData: BasePokemon;
    };
    leveledUp: boolean;
};
export declare const handleExperienceGain: (data: TParams) => Promise<TResponse>;
export {};
