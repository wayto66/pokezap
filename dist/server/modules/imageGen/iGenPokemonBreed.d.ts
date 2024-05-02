import { BasePokemon, Pokemon, Talent } from '@prisma/client';
type TParams = {
    pokemon1: Pokemon & {
        baseData: BasePokemon;
        talent1: Talent;
        talent2: Talent;
        talent3: Talent;
        talent4: Talent;
        talent5: Talent;
        talent6: Talent;
        talent7: Talent;
        talent8: Talent;
        talent9: Talent;
    };
    pokemon2: Pokemon & {
        baseData: BasePokemon;
        talent1: Talent;
        talent2: Talent;
        talent3: Talent;
        talent4: Talent;
        talent5: Talent;
        talent6: Talent;
        talent7: Talent;
        talent8: Talent;
        talent9: Talent;
    };
};
export declare const iGenPokemonBreed: (data: TParams) => Promise<string>;
export {};
