import { PokemonBaseData } from '../modules/duel/duelNXN';
export declare const getPokemon: (prismaClient: PrismaClient, pokemonIdString: string, playerId: number) => Promise<PokemonBaseData | null>;
