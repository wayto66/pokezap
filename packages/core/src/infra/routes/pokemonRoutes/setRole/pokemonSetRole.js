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
exports.pokemonSetRole = void 0;
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonSetRole = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const [, , , pokemonIdString, roleUppercase] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParameterError('Nome/Id do Pokemon e nome do Item');
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
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
        onlyAdult: true,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield prisma.pokemon.findFirst({
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
    if (!pokemon || !pokemon.isAdult)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    if (!roleUppercase)
        throw new AppErrors_1.MissingParameterSetRoleRouteError((_a = pokemon.nickName) !== null && _a !== void 0 ? _a : pokemon.baseData.name);
    const role = roleUppercase.toLowerCase();
    if (!['damage', 'tanker', 'support'].includes(role))
        throw new AppErrors_1.UnexpectedError('invalid role');
    yield prisma.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            role: roleUppercase,
        },
    });
    return {
        message: `#${pokemon.id} ${(_c = (_b = pokemon.nickName) === null || _b === void 0 ? void 0 : _b.toUpperCase()) !== null && _c !== void 0 ? _c : pokemon.baseData.name.toUpperCase()} foi atribuido à função *${roleUppercase}*`,
        status: 200,
        data: null,
    };
});
exports.pokemonSetRole = pokemonSetRole;
