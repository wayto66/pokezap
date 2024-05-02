import { BasePokemon, Pokemon } from '@prisma/client';
import { PokemonBaseData } from '../duel/duelNXN';
type TParams = {
    pokemon: PokemonBaseData;
    targetLevel: number;
    removeFromDaycare?: boolean;
};
type TResponse = {
    pokemon: Pokemon & {
        baseData: BasePokemon;
    };
    leveledUp: boolean;
};
export declare const handleLevelSet: (data: TParams) => Promise<TResponse>;
export {};
