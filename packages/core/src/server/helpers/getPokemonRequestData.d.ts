type TGetPokemonRequestData = {
    searchMode: string;
    pokemonId: number;
    pokemonIdentifierString: string;
    playerId: number;
    onlyAdult?: boolean;
    includeNotOwned?: boolean;
};
export declare const getPokemonRequestData: ({ searchMode, pokemonId, pokemonIdentifierString, playerId, onlyAdult, includeNotOwned, }: TGetPokemonRequestData) => {
    identifier: number;
    where: {
        id: number;
        isAdult: boolean;
        OR?: undefined;
        ownerId?: undefined;
    };
} | {
    identifier: string;
    where: {
        OR: ({
            baseData: {
                name: string;
            };
            nickName?: undefined;
        } | {
            nickName: string;
            baseData?: undefined;
        })[];
        ownerId: number | undefined;
        isAdult: boolean;
        id?: undefined;
    };
} | {
    identifier: number;
    where: {
        id: number;
        isAdult?: undefined;
        OR?: undefined;
        ownerId?: undefined;
    };
} | {
    identifier: string;
    where: {
        OR: ({
            baseData: {
                name: string;
            };
            nickName?: undefined;
        } | {
            nickName: string;
            baseData?: undefined;
        })[];
        ownerId: number | undefined;
        id?: undefined;
        isAdult?: undefined;
    };
} | undefined;
export {};
