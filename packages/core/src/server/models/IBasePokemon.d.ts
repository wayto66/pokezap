export interface IBasePokemon {
    id: number;
    pokedexId: number;
    name: string;
    defaultSpriteUrl: string;
    shinySpriteUrl: string;
    type1Name: string;
    type2Name: string | null;
    BaseHp: number;
    BaseAtk: number;
    BaseDef: number;
    BaseSpAtk: number;
    BaseSpDef: number;
    BaseSpeed: number;
    BaseAllStats: number;
    BaseExperience: number;
    type2?: any;
    evolutionData: {
        evolutionChain: [
            {
                is_baby: boolean;
                species: any;
                evolves_to: any[];
                evolution_details: any[];
            }
        ];
        isFirstEvolution: boolean;
    } | any;
    statusTrashed: boolean;
    createdAt: Date;
    updatedAt: Date;
}
