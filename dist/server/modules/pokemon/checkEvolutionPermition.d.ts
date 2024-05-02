type TParams = {
    pokemonId: number;
    playerId: number;
    fromTrade?: boolean;
    preferredPokemonName?: string;
};
export declare const checkEvolutionPermition: (data: TParams) => Promise<{
    message: string;
    status: string;
}>;
export {};
