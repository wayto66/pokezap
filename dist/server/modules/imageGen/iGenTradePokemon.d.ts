import { BasePokemon, Pokemon } from '@prisma/client';
type TParams = {
    pokemon1: Pokemon & {
        baseData: BasePokemon;
    };
    pokemon2: Pokemon & {
        baseData: BasePokemon;
    };
};
export declare const iGenTradePokemon: (data: TParams) => Promise<string>;
export {};
