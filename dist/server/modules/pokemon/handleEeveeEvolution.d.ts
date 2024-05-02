type TParams = {
    pokemonId: number;
    playerId: number;
    fromTrade?: boolean;
};
export declare const handleEeveeEvolution: (data: TParams) => Promise<{
    message: string;
    status: string;
}>;
export {};
