import { BasePokemon, Pokemon } from '@prisma/client';
type TParams = {
    pokemons: (Pokemon & {
        baseData: BasePokemon;
    })[];
    remainingHoursMap: Map<number, number>;
};
export declare const iGenDaycareInfo: (data: TParams) => Promise<string>;
export {};
