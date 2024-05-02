import { Player } from '@prisma/client';
export type TQuestCheckData = {
    player: Player;
    requestedElement: string;
    requestedAmount: number;
};
export type TQuestCheckResponse = {
    done: boolean;
    remaining?: number;
};
export declare const questCheck: ({ player, requestedAmount, requestedElement, }: TQuestCheckData) => Promise<TQuestCheckResponse>;
