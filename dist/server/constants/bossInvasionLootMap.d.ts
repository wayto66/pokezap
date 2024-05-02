export type LootData = {
    itemName: string;
    dropChance: number;
    dropAmount?: [number, number];
};
export declare const bossInvasionLootMap: Map<string, LootData[]>;
