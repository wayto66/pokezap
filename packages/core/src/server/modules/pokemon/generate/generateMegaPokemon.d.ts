import { RaidPokemonBaseDataSkills } from '../../../../types';
type TParams = {
    name: string;
    level: number;
    shinyChance: number;
};
export declare const generateMegaPokemon: (data: TParams) => Promise<RaidPokemonBaseDataSkills>;
export {};
