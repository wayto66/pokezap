import { BasePokemon, Pokemon } from '@prisma/client';
export type DuelPokemonExtra = Pokemon & {
    baseData: BasePokemon;
    manaBonus?: number | undefined;
    lifeSteal?: number | undefined;
    critChance?: number | undefined;
    blockChance?: number | undefined;
    crescentBonuses?: {
        block?: number;
        damage?: number;
    };
    statusCleanseChance?: number;
    healingBonus?: number;
    buffBonus?: number;
};
type TParams = {
    poke: DuelPokemonExtra;
    team: ((Pokemon & {
        baseData: BasePokemon;
    }) | null)[] | undefined;
};
export declare const getTeamBonuses: (data: TParams) => Promise<DuelPokemonExtra>;
export {};
