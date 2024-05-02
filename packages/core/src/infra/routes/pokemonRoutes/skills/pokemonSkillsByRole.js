"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonSkillsByRole = void 0;
const getBestSkillSet_1 = require("../../../../server/helpers/getBestSkillSet");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonSkillsByRole = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , elementUppercase, pokemonName] = data.routeParams;
    if (!elementUppercase)
        throw new AppErrors_1.MissingParameterError('função');
    if (!pokemonName)
        throw new AppErrors_1.MissingParameterError('nome do pokemon');
    const pokemon = yield prisma.basePokemon.findFirst({
        where: {
            name: pokemonName.toLowerCase(),
        },
        include: {
            skills: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonName);
    const skillTable = pokemon.skillTable;
    const skillMap = new Map([]);
    for (const skill of skillTable) {
        const split = skill.split('%');
        skillMap.set(split[0], split[1]);
    }
    const skills = pokemon.skills;
    const skillDisplays = [];
    const getCheckFunction = () => {
        if (elementUppercase === 'TANKER')
            return getBestSkillSet_1.checkIfSkillIsTankerSkill;
        if (elementUppercase === 'SUPPORT')
            return getBestSkillSet_1.checkIfSkillIsSupportSkill;
        return (skill) => {
            return skill.attackPower > 0;
        };
    };
    const checkFunction = getCheckFunction();
    for (const skill of skills) {
        if (!checkFunction(skill))
            continue;
        const skillLevel = skillMap.get(skill.name);
        const skillDisplay = `*${skill.name}* -PWR:${skill.attackPower} -LVL:${skillLevel}-CLASSE:${skill.class}`;
        skillDisplays.push(skillDisplay);
    }
    return {
        message: `SKILLS DO TIPO ${elementUppercase} para ${pokemonName.toUpperCase()}: \n\n${skillDisplays.join('\n')}`,
        status: 200,
        data: null,
    };
});
exports.pokemonSkillsByRole = pokemonSkillsByRole;
