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
exports.getPokemon = void 0;
const AppErrors_1 = require("../../infra/errors/AppErrors");
const getPokemonRequestData_1 = require("./getPokemonRequestData");
const getPokemon = (prismaClient, pokemonIdString, playerId) => __awaiter(void 0, void 0, void 0, function* () {
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
        onlyAdult: true,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    return yield prismaClient.pokemon.findFirst({
        where: pokemonRequestData.where,
        include: {
            baseData: true,
            owner: true,
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
});
exports.getPokemon = getPokemon;
