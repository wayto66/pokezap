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
exports.marketRemove = void 0;
const getPokemonRequestData_1 = require("../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../errors/AppErrors");
const marketRemove = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString] = data.routeParams;
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
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
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
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    if (!(pokemon === null || pokemon === void 0 ? void 0 : pokemon.isAnnouncedInMarket)) {
        return {
            message: `#${pokemon.id} - ${pokemon.baseData.name} não está anunciado no Market.`,
            status: 200,
            actions: [],
        };
    }
    yield prisma.$transaction([
        prisma.pokemon.update({
            where: {
                id: pokemon.id,
            },
            data: {
                isAnnouncedInMarket: false,
            },
        }),
        prisma.marketOffer.updateMany({
            where: {
                pokemonDemand: {
                    some: {
                        id: pokemon.id,
                    },
                },
            },
            data: {
                active: false,
            },
        }),
    ]);
    return {
        message: `#${pokemon.id} - ${pokemon.baseData.name} foi removido no Market.`,
        status: 200,
        actions: [],
    };
});
exports.marketRemove = marketRemove;
