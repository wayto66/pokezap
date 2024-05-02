import { Player, Pokemon } from '@prisma/client';
type DuelPlayer = Player & {
    teamPoke1: Pokemon | null;
    teamPoke2: Pokemon | null;
};
type TParams = {
    player1: DuelPlayer;
    player2: DuelPlayer;
};
export declare const iGenDuelX2: (data: TParams) => Promise<string | undefined>;
export {};
