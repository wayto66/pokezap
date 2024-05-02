import { PokemonBaseDataSkillsHeld } from '../duel/duelNXN';
type TParams = {
    pokemons: PokemonBaseDataSkillsHeld[];
};
export declare const iGenInventoryPokemons: (data: TParams) => Promise<string | undefined>;
export {};
