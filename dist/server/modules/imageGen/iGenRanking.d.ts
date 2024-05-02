type RankEntry = {
    name: string;
    value: string | number;
    id: number | string;
};
type TParams = {
    rankEntries: RankEntry[];
    rankingTitle: string;
    playerName?: string;
    playerValue?: string;
    startOffset?: number;
    endOffset?: number;
};
export declare const iGenRanking: (data: TParams) => Promise<string>;
export {};
