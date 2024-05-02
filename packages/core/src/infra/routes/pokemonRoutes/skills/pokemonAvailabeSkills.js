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
exports.pokemonAvailabeSkills = void 0;
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const duelNXN_1 = require("../../../../server/modules/duel/duelNXN");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonAvailabeSkills = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [, , , pokemonIdString, all] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const basePokemonNamesPre = yield prisma.basePokemon.findMany({
        select: {
            name: true,
        },
    });
    const basePokemonNames = basePokemonNamesPre.map(p => p.name);
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
        includeNotOwned: !basePokemonNames.includes(pokemonIdString.toLowerCase()),
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield prisma.pokemon.findFirst({
        where: pokemonRequestData.where,
        include: {
            baseData: {
                include: {
                    skills: true,
                },
            },
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
            owner: true,
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    const skillTable = pokemon.baseData.skillTable;
    const skillMap = new Map([]);
    for (const skill of skillTable) {
        const split = skill.split('%');
        skillMap.set(split[0], split[1]);
    }
    const skills = pokemon.baseData.skills.sort((a, b) => a.name.localeCompare(b.name));
    const skillDisplays = [];
    for (const skill of skills) {
        if (skill.attackPower === 0 && all !== 'ALL')
            continue;
        const skillLevel = Number((_a = skillMap.get(skill.name)) !== null && _a !== void 0 ? _a : '0');
        if (skillLevel !== 999 && skillLevel > pokemon.level)
            continue;
        if (skillLevel === 999 && pokemon.TMs < 3)
            continue;
        const permit = (0, duelNXN_1.verifyTalentPermission)(pokemon, skill);
        if (!permit.permit)
            continue;
        const skillDisplay = `${skillLevel === 999 ? '[tm] ' : ''}*${skill.name}* - PODER: *${skill.attackPower}* - TIPO: *${skill.typeName}*`;
        skillDisplays.push(skillDisplay);
    }
    return {
        message: `Habilidades disponíveis para ${((_b = pokemon.nickName) !== null && _b !== void 0 ? _b : pokemon.baseData.name).toUpperCase()}: \n\n${skillDisplays.join('\n')}`,
        status: 200,
        data: null,
    };
});
exports.pokemonAvailabeSkills = pokemonAvailabeSkills;
