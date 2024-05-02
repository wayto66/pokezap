import { BasePokemon, Pokemon } from '@prisma/client';
type TParams = {
    pokemons: (Pokemon & {
        baseData: BasePokemon;
    })[];
};
export declare const iGenRocketInvasion: (data: TParams) => Promise<string>;
export {};
