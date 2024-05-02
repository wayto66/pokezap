import { BasePokemon, Pokemon } from '@prisma/client';
export type RoundPokemonData = {
    name: string;
    id: number;
    ownerId?: number;
    spriteUrl: string;
    type1: string;
    type2: string | undefined | null;
    level: number;
    maxHp: number;
    hp: number;
    speed: number;
    skillPower: number;
    skillName: string;
    skillType: string;
    ultimatePower: number;
    ultimateName: string;
    ultimateType: string;
    currentSkillPower: number;
    currentSkillName: string;
    currentSkillType: string;
    crit: boolean;
    block: boolean;
    mana: number;
    hasUltimate: boolean;
    manaBonus: number;
    lifeSteal: number;
    critChance: number;
    blockChance: number;
};
export type BossInvasionRoundData = {
    alliesTeamData: RoundPokemonData[];
    bossData: RoundPokemonData;
};
type DuelPokemon = Pokemon & {
    baseData: BasePokemon;
    skillName?: string | undefined;
    skillType?: string | undefined;
    ultimateType?: string | undefined;
};
type TParams = {
    playerTeam: DuelPokemon[];
    boss: DuelPokemon;
};
export type TDuelX2Response = {
    winnerTeam: RoundPokemonData[];
    loserTeam: RoundPokemonData[];
    message: string;
    isDraw: boolean;
    imageUrl: string;
};
export declare const duelNX1: (data: TParams) => Promise<TDuelX2Response | void>;
export {};
