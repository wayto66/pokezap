import { GymPokemon } from '@prisma/client';
type TParams = {
    name: string;
    level: number;
    ownerId: number;
};
export declare const generateGymPokemons: (data: TParams) => Promise<GymPokemon>;
export {};
