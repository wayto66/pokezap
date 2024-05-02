import { GameRoom, Player } from '@prisma/client';
type TParams = {
    player: Player;
    gameRoom: GameRoom;
};
export declare const spawnTutorialPokemon: (data: TParams) => Promise<{
    pokemon: import(".prisma/client").Pokemon & {
        baseData: import(".prisma/client").BasePokemon;
        talent1: import(".prisma/client").Talent;
        talent2: import(".prisma/client").Talent;
        talent3: import(".prisma/client").Talent;
        talent4: import(".prisma/client").Talent;
        talent5: import(".prisma/client").Talent;
        talent6: import(".prisma/client").Talent;
        talent7: import(".prisma/client").Talent;
        talent8: import(".prisma/client").Talent;
        talent9: import(".prisma/client").Talent;
    };
    imageUrl: string | undefined;
}>;
export {};
