import { IBasePokemon } from './IBasePokemon';
import { ISkill } from './ISkill';
import { ITalent } from './ITalent';
export interface IType {
    id: number;
    name: string;
    basePokemons1: IBasePokemon[];
    basePokemons2: IBasePokemon[];
    talents: ITalent[];
    skills: ISkill[];
}
