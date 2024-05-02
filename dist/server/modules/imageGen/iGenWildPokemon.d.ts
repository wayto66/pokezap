import { PokemonBaseData } from '../duel/duelNXN';
type TParams = {
    pokemon: PokemonBaseData;
};
export declare const iGenWildPokemon: (data: TParams) => Promise<string | undefined>;
export {};
