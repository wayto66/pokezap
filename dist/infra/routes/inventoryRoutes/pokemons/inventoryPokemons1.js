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
exports.inventoryPokemons1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const talentIdMap_1 = require("../../../../server/constants/talentIdMap");
const iGenInventoryPokemons_1 = require("../../../../server/modules/imageGen/iGenInventoryPokemons");
const inventoryPokemons1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pageOrFilter, ...filteredOptions] = data.routeParams;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedPokemons: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    let page = 1;
    if (!isNaN(Number(pageOrFilter)))
        page = Number(pageOrFilter);
    if (!isNaN(Number(filteredOptions[filteredOptions.length - 1])))
        page = Number(filteredOptions[filteredOptions.length - 1]);
    const filter = pageOrFilter !== undefined ? pageOrFilter.toUpperCase() : '';
    const isFilteredByEggs = ['EGGS', 'EGG', 'OVO', 'OVOS'].includes(filter);
    const isFilteredByTalents = ['TALENT', 'TALENTS', 'TALENTO', 'TALENTOS'].includes(filter);
    const isFilteredByNames = ['NAME', 'NAMES', 'NOME', 'NOMES'].includes(filter);
    const isFilteredByTypes = ['TYPE', 'TYPES', 'TIPO', 'TIPOS'].includes(filter);
    let baseData;
    let filteredNumbers = [];
    function getTalentNumber(talent) {
        for (const [number, talentName] of talentIdMap_1.talentIdMap) {
            if (talentName === talent) {
                return number;
            }
        }
        return undefined;
    }
    const filteredOptionsLowerCase = filteredOptions
        .map(value => {
        const numberValue = Number(value);
        if (isNaN(numberValue))
            return value.toLowerCase();
    })
        .filter(value => value !== undefined);
    if (isFilteredByTypes) {
        baseData = {
            OR: [{ type1Name: { in: filteredOptionsLowerCase } }, { type2Name: { in: filteredOptionsLowerCase } }],
        };
    }
    else if (isFilteredByNames) {
        baseData = {
            OR: filteredOptionsLowerCase.map(option => ({ name: { contains: option } })),
        };
    }
    else if (isFilteredByTalents) {
        filteredNumbers = filteredOptionsLowerCase
            .map((option) => {
            if (option)
                return getTalentNumber(option);
        })
            .filter((number) => number !== null);
    }
    const pokemons = yield prismaClient.pokemon.findMany({
        where: {
            ownerId: player.id,
            isAdult: !isFilteredByEggs,
            isInDaycare: false,
            baseData,
            OR: filteredNumbers.length > 0
                ? filteredNumbers.map(number => ({
                    OR: [
                        { talentId1: number },
                        { talentId2: number },
                        { talentId3: number },
                        { talentId4: number },
                        { talentId5: number },
                        { talentId6: number },
                        { talentId7: number },
                        { talentId8: number },
                        { talentId9: number },
                    ],
                }))
                : undefined,
        },
        include: {
            baseData: {
                include: {
                    skills: true,
                },
            },
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    function getTalentCount(pokemon) {
        let count = 0;
        for (let i = 1; i <= 9; i++) {
            const talentId = pokemon[`talentId${i}`];
            if (talentId && filteredNumbers.length > 0 && filteredNumbers.includes(talentId)) {
                count++;
            }
        }
        return count;
    }
    if (isFilteredByTalents) {
        pokemons.sort((a, b) => {
            const aTalentCount = getTalentCount(a);
            const bTalentCount = getTalentCount(b);
            return bTalentCount - aTalentCount;
        });
    }
    else {
        pokemons.sort((a, b) => {
            return b.level - a.level;
        });
    }
    const pokemonsTake20 = pokemons.slice(Math.max(0, (page - 1) * 20), Math.max(0, (page - 1) * 20) + 20);
    const imageUrl = yield (0, iGenInventoryPokemons_1.iGenInventoryPokemons)({
        pokemons: pokemonsTake20,
    });
    const actions = [`pz. inventory poke ${pageOrFilter} ${filteredOptionsLowerCase} ${page + 1}`];
    return {
        message: `Página ${page} de Pokemons de ${player.name}.
    👍 - Próxima página`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions,
    };
});
exports.inventoryPokemons1 = inventoryPokemons1;
//# sourceMappingURL=inventoryPokemons1.js.map