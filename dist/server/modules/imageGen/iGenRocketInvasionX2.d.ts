import { InvasionSession } from '@prisma/client';
import { DuelPokemon } from '../../../infra/routes/duelRoutes/duelAccept';
type TParams = {
    pokemon1: DuelPokemon;
    pokemon2: DuelPokemon;
    invasionSession: InvasionSession;
};
export declare const iGenRocketInvasionX2: (data: TParams) => Promise<string>;
export {};
