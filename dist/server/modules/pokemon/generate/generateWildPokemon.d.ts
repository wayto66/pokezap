import { BasePokemon, Skill } from '@prisma/client';
type TParams = {
    baseData: BasePokemon & {
        skills: Skill[];
    };
    level: number;
    shinyChance: number;
    savage: boolean;
    isAdult: boolean;
    talentIds?: number[];
    gameRoomId?: number;
    fromIncense?: boolean;
};
export declare const generateWildPokemon: (data: TParams) => Promise<import(".prisma/client").Pokemon & {
    baseData: BasePokemon;
    talent1: import(".prisma/client").Talent;
    talent2: import(".prisma/client").Talent;
    talent3: import(".prisma/client").Talent;
    talent4: import(".prisma/client").Talent;
    talent5: import(".prisma/client").Talent;
    talent6: import(".prisma/client").Talent;
    talent7: import(".prisma/client").Talent;
    talent8: import(".prisma/client").Talent;
    talent9: import(".prisma/client").Talent;
}>;
export {};
