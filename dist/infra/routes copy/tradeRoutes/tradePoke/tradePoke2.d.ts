import { IPokemon } from '../../../../server/models/IPokemon';
import { IResponse } from '../../../../server/models/IResponse';
import { ISession } from '../../../../server/models/ISession';
export type TTradePokeParams = {
    creatorPokemon: IPokemon & any;
    invitedPokemon: IPokemon & any;
    session: ISession;
};
export declare const tradePoke2: (data: TTradePokeParams) => Promise<IResponse>;
