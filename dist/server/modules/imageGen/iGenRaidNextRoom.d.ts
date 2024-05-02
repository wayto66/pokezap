import { Raid } from '@prisma/client';
import { RaidPokemonBaseData } from '../duel/duelNXN';
type TParams = {
    enemyPokemons: RaidPokemonBaseData[];
    raid: Raid;
};
export declare const iGenRaidNextRoom: (data: TParams) => Promise<string | undefined>;
export {};
