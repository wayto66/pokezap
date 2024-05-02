import { BasePokemon, Player, Pokemon, Skill } from '@prisma/client';
import { IResponse } from '../../../server/models/IResponse';
import { TRouteParams } from '../router';
export type DuelPokemon = Pokemon & {
    baseData: BasePokemon & {
        skills: Skill[];
    };
};
export type DuelPlayer = Player & {
    teamPoke1: DuelPokemon | null;
};
export declare const duelAccept: (data: TRouteParams) => Promise<IResponse>;
