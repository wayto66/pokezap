import { IPokemon } from '../../../../server/models/IPokemon';
import { IResponse } from '../../../../server/models/IResponse';
import { ISession } from '../../../../server/models/ISession';
export type TParams = {
    creatorPokemon: IPokemon;
    invitedPokemon: IPokemon;
    session: ISession;
};
export declare const tradePokeEvolutionTrigger: (data: TParams) => Promise<IResponse>;
