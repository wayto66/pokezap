import { BaseItem, BasePokemon, HeldItem, Pokemon } from '@prisma/client';
type TParams = Pokemon & {
    baseData: BasePokemon;
    heldItem?: (HeldItem & {
        baseItem: BaseItem;
    }) | null;
};
export declare const iGenPokemonAnalysis: (pokemon: TParams) => Promise<string | undefined>;
export {};
