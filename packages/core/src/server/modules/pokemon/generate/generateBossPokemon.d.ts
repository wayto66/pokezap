import { BasePokemon } from '@prisma/client';
type TParams = {
    baseData: BasePokemon;
    level: number;
    shinyChance: number;
    savage: boolean;
    talentIds?: number[];
    gameRoomId?: number;
};
export declare const generateBossPokemon: (data: TParams) => Promise<any>;
export {};
