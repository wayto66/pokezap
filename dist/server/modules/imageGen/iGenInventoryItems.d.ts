import { BaseItem, BasePokemon, HeldItem, Item, Player, Pokemon } from '@prisma/client';
type TParams = {
    playerData: Player & {
        ownedItems: (Item & {
            baseItem: BaseItem;
        })[];
        ownedPokemons: (Pokemon & {
            baseData: BasePokemon;
            heldItem: (HeldItem & {
                baseItem: BaseItem;
            }) | null;
        })[];
    };
};
export declare const iGenInventoryItems: (data: TParams) => Promise<string>;
export {};
