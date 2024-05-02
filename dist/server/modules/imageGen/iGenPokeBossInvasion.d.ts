import { BasePokemon, InvasionSession, Pokemon } from '@prisma/client';
type TParams = {
    pokeBoss: Pokemon & {
        baseData: BasePokemon;
    };
    invasionSession: InvasionSession;
};
export declare const iGenPokeBossInvasion: (data: TParams) => Promise<string>;
export {};
