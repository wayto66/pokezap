import { PokemonBaseData, PokemonBaseDataSkillsHeld, RaidPokemonBaseData, RaidPokemonBaseDataSkillsHeld, TDuelNXNResponse } from '../../../types';
type TParams = {
    leftTeam: PokemonBaseDataSkillsHeld[];
    rightTeam: PokemonBaseDataSkillsHeld[] | RaidPokemonBaseDataSkillsHeld[];
    wildBattle?: true;
    staticImage?: boolean;
    returnOnlyPlayerPokemonDefeatedIds?: boolean;
    backgroundTypeName?: string;
};
export declare const ContinuousDuel6x6: (data: TParams) => Promise<TDuelNXNResponse | void>;
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
export declare const verifyTalentPermission: (poke: PokemonBaseData | RaidPokemonBaseData, skill: Skill) => Promise<{
    permit: boolean;
    count: any;
}>;
export {};
