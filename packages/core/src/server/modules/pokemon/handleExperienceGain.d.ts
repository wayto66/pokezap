import { RaidPokemonBaseData } from '../../../types';
import { BasePokemon, Pokemon } from '../../../types/prisma';
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
