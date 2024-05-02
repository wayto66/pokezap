import { GameRoom } from '@prisma/client';
type TRocketDuoInvasionParams = {
    gameRoom: GameRoom;
};
export declare const rocketDuoInvasion: (data: TRocketDuoInvasionParams) => Promise<void>;
export {};
