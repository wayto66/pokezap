export type RaidMapData = {
    enemies: string[];
    rooms: number;
    difficult: 'easy' | 'medium' | 'hard' | 'expert' | 'insane';
    loot: {
        name: string;
        dropRate: number;
        amount: [number, number];
        coreLoot?: true;
    }[];
    type: string;
};
export declare const raidsDataMap: Map<string, RaidMapData>;
