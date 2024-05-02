import { BasePokemon, Pokemon } from '@prisma/client';
import { PokemonBaseData } from '../duel/duelNXN';
type TParams = {
    poke1: PokemonBaseData;
    poke2: PokemonBaseData;
};
export declare const breed: (data: TParams) => Promise<Pokemon & {
    baseData: BasePokemon;
}>;
export {};
