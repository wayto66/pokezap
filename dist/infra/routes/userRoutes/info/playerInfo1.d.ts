import { IResponse } from '../../../../server/models/IResponse';
type TUserInfoParams = {
    playerPhone: string;
    routeParams: string[];
    playerName: string;
};
export declare const playerInfo1: (data: TUserInfoParams) => Promise<IResponse>;
export {};
