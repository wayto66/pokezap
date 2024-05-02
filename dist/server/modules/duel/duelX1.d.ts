import { BasePokemon, Pokemon } from '@prisma/client';
type TParams = {
    poke1: Pokemon & {
        baseData: BasePokemon;
    };
    poke2: Pokemon & {
        baseData: BasePokemon;
    };
    againstWildPokemon?: boolean;
};
type TResponse = {
    winner: any | null;
    loser: any | null;
    message: string;
    isDraw: boolean;
    imageUrl: string;
};
export declare const duelX1: (data: TParams) => Promise<TResponse | void>;
export {};
