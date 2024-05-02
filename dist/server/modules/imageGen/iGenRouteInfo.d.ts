import { BaseRoomUpgrades, GameRoom, RoomUpgrades } from '@prisma/client';
type TParams = {
    route: GameRoom & {
        upgrades: (RoomUpgrades & {
            base: BaseRoomUpgrades;
        })[];
    };
};
export declare const iGenRouteInfo: (data: TParams) => Promise<string>;
export {};
