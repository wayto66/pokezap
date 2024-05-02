import { BaseItem, Item, Player } from '@prisma/client';
import { IResponse } from '../../server/models/IResponse';
import { PokemonBaseData } from '../../server/modules/duel/duelNXN';
export type TRouteParams = {
    playerPhone: string;
    groupCode: string;
    routeParams: string[];
    playerName: string;
    fromReact?: boolean;
    player?: Player & {
        ownedPokemons: PokemonBaseData;
        ownedItems: Item & {
            baseItem: BaseItem;
        };
    };
};
export declare const router: (data: TRouteParams) => Promise<IResponse>;
