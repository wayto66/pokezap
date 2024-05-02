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
exports.ranchInfo = void 0;
const tsyringe_1 = require("tsyringe");
const getHoursDifference_1 = require("../../../../server/helpers/getHoursDifference");
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const iGenWildPokemon_1 = require("../../../../server/modules/imageGen/iGenWildPokemon");
const AppErrors_1 = require("../../../errors/AppErrors");
const ranchInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError('', data.groupCode);
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            activeWildPokemon: true,
            upgrades: {
                include: {
                    base: true,
                },
            },
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!route.upgrades.map(upg => upg.base.name).includes('poke-ranch'))
        throw new AppErrors_1.RouteDoesNotHaveUpgradeError('poke-ranch');
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield prismaClient.pokemon.findFirst({
        where: {
            id: pokemonId,
            gameRoomId: route.id,
            savage: true,
            owner: undefined,
            ownerId: undefined,
        },
        include: {
            baseData: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    const hoursDiff = (0, getHoursDifference_1.getHoursDifference)(pokemon.createdAt, new Date());
    if (hoursDiff > 12)
        throw new AppErrors_1.PokemonExceededRanchTimeLimit(pokemon.id, pokemon.baseData.name);
    const imageUrl = yield (0, iGenWildPokemon_1.iGenWildPokemon)({
        pokemon,
    });
    const displayName = pokemon.isShiny ? `shiny ${pokemon.baseData.name}` : `${pokemon.baseData.name}`;
    return {
        message: `*${player.name}* acaba de encontrar *#${pokemon.id} ${displayName}* no poke-ranch!
Ações:
👍 - Batalha Rápida
`,
        status: 200,
        imageUrl,
        actions: [`pz. battle ${pokemon.id} fast`],
    };
});
exports.ranchInfo = ranchInfo;
//# sourceMappingURL=ranchInfo.js.map