import { BaseItem, BasePokemon } from '@prisma/client';
type TParams = {
    boss: BasePokemon;
    enemyPokemons: BasePokemon[];
    backgroundName: string;
    possibleLoot: BaseItem[];
};
export declare const iGenRaidCreate: (data: TParams) => Promise<string | undefined>;
export {};
