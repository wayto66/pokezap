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
exports.pokemonSkills = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonSkillsByRole_1 = require("./pokemonSkillsByRole");
const pokemonSkills = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const [, , , element, pokemonName] = data.routeParams;
    if (!element)
        throw new AppErrors_1.MissingParameterError('elemento de ataque');
    if (!pokemonName)
        throw new AppErrors_1.MissingParameterError('nome do pokemon');
    let mode = 'type';
    const type = yield prismaClient.type.findFirst({
        where: {
            name: element.toLowerCase(),
        },
    });
    if (!type) {
        if (['TANKER', 'SUPPORT', 'DAMAGE'].includes(element)) {
            return yield (0, pokemonSkillsByRole_1.pokemonSkillsByRole)(data);
        }
        else {
            throw new AppErrors_1.UnexpectedError(`Tipo "${element}" não é um tipo válido.`);
        }
    }
    const pokemon = yield prismaClient.basePokemon.findFirst({
        where: {
            name: pokemonName.toLowerCase(),
        },
        include: {
            skills: {
                where: {
                    typeName: type.name,
                },
            },
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
    for (const skill of skills) {
        const skillLevel = skillMap.get(skill.name);
        const skillDisplay = `*${skill.name}* -PWR:${skill.attackPower} -LVL:${skillLevel}-CLASSE:${skill.class}\n `;
        skillDisplays.push(skillDisplay);
    }
    return {
        message: `SKILLS DO TIPO ${type.name.toUpperCase()} para ${pokemonName.toUpperCase()}: \n\n${skillDisplays}`,
        status: 200,
        data: null,
    };
});
exports.pokemonSkills = pokemonSkills;
//# sourceMappingURL=pokemonSkills.js.map