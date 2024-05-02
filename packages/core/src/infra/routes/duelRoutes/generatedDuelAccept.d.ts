import { IResponse } from '../../../server/models/IResponse';
import { BasePokemon, Player, Pokemon, Skill } from '../../../types/prisma';
import { TRouteParams } from '../router';
export type DuelPokemon = Pokemon & {
    baseData: BasePokemon & {
        skills: Skill[];
    };
};
export type DuelPlayer = Player & {
    teamPoke1: DuelPokemon | null;
};
export declare const generatedDuelAccept: (data: TRouteParams) => Promise<IResponse>;
