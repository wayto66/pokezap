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
exports.pokemonInfo1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const iGenPokemonAnalysis_1 = require("../../../../server/modules/imageGen/iGenPokemonAnalysis");
const pokemonInfo1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const [, , , pokemonIdString] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const basePokemonNamesPre = yield prismaClient.basePokemon.findMany({
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
    const pokemon = yield prismaClient.pokemon.findFirst({
        where: pokemonRequestData.where,
        include: {
            baseData: true,
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
    const imageUrl = yield (0, iGenPokemonAnalysis_1.iGenPokemonAnalysis)(pokemon);
    if (!pokemon.isAdult && pokemon.owner)
        return {
            message: `#${pokemon.id} de *${pokemon.owner.name}* ! `,
            status: 200,
            data: null,
            imageUrl: imageUrl,
        };
    if (pokemon.owner) {
        return {
            message: `#${pokemon.id} ${(_a = pokemon.nickName) !== null && _a !== void 0 ? _a : pokemon.baseData.name.toUpperCase()} de *${pokemon.owner.name}* ! `,
            status: 200,
            data: null,
            imageUrl: imageUrl,
        };
    }
    return {
        message: `#${pokemon.id} ${pokemon.baseData.name.toUpperCase()} selvagem! `,
        status: 200,
        data: null,
        imageUrl: imageUrl,
    };
});
exports.pokemonInfo1 = pokemonInfo1;
//# sourceMappingURL=pokemonInfo1.js.map