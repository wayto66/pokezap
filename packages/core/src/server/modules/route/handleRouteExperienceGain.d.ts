import { BasePokemon, GameRoom, Player, Pokemon } from '../../../types/prisma';
type TParams = {
    pokemon: Pokemon;
    targetPokemon: Pokemon & {
        baseData: BasePokemon;
    };
    bonusExpMultiplier?: number;
    route: GameRoom & {
        players: Player[];
    };
};
type TResponse = {
    route: GameRoom & {
        players: Player[];
    };
    leveledUp: boolean;
};
export declare const handleRouteExperienceGain: (data: TParams) => Promise<TResponse>;
export {};
