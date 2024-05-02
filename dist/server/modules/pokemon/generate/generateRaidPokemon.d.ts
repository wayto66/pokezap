import { RaidPokemonBaseDataSkills } from '../../duel/duelNXN';
type TParams = {
    name: string;
    level: number;
    talentIds?: number[];
    shinyBonusChance?: number;
};
export declare const generateRaidPokemon: (data: TParams) => Promise<RaidPokemonBaseDataSkills>;
export {};
