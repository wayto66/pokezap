import { PokemonBaseData, PokemonBaseDataSkillsHeld, RaidPokemonBaseData, RaidPokemonBaseDataSkillsHeld, TDuelNXNResponse } from '../../../types';
type TParams = {
    leftTeam: PokemonBaseDataSkillsHeld[];
    rightTeam: PokemonBaseDataSkillsHeld[] | RaidPokemonBaseDataSkillsHeld[];
    wildBattle?: true;
    staticImage?: boolean;
    returnOnlyPlayerPokemonDefeatedIds?: boolean;
    backgroundTypeName?: string;
    forceWin?: boolean;
};
export declare const duelNXN: (data: TParams) => Promise<TDuelNXNResponse | void>;
export type EffectivenessData = {
    innefective: string[];
    effective: string[];
    noDamage: string[];
};
export type TypeScoreObject = {
    best: string[];
    good: string[];
    neutral: string[];
    bad: string[];
    worse: string[];
};
export declare const verifyTalentPermission: (poke: PokemonBaseData | RaidPokemonBaseData, skill: Skill) => {
    permit: boolean;
    count: number;
};
export {};
