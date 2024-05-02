import { Pokemon, RaidPokemon, Skill } from '@prisma/client';
import { PokemonBaseData, RaidPokemonBaseData } from '../modules/duel/duelNXN';
export type enemyName = string;
export type attackPower = number;
export declare function getBestSkillSet(pokemonSkillMap: [number, Skill][], attacker: Pokemon | RaidPokemon, defenderTeam: PokemonBaseData[] | RaidPokemonBaseData[]): {
    damageSkills: Map<Skill, Map<enemyName, attackPower>>;
    tankerSkills: Skill[];
    supportSkills: Skill[];
};
export declare const checkIfSkillIsTankerSkill: (skill: Skill) => boolean;
export declare const checkIfSkillIsSupportSkill: (skill: Skill) => boolean;
