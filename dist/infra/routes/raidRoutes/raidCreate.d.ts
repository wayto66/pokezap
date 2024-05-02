import { IResponse } from '../../../server/models/IResponse';
import { TRouteParams } from '../router';
export type TRaidDifficultData = {
    shinyChance: number;
    bossLevel: number;
    enemiesLevel: number;
    cashReward: number;
    dropRate: number;
    roomCount: number;
};
export declare const raidDifficultyDataMap: Map<string, TRaidDifficultData>;
export declare const raidCreate: (data: TRouteParams) => Promise<IResponse>;
