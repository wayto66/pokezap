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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokeranchRoute = void 0;
const iGenWildPokemon_1 = require("../../../../../../image-generator/src/iGenWildPokemon");
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const getHoursDifference_1 = require("../../../../server/helpers/getHoursDifference");
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokeranchRoute = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    const searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (isNaN(pokemonId))
        throw new AppErrors_1.TypeMissmatchError(pokemonIdString, 'número');
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: true,
            teamPoke2: true,
            teamPoke3: true,
            teamPoke4: true,
            teamPoke5: true,
            teamPoke6: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const route = yield src_1.default.gameRoom.findFirst({
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
    const pokemon = yield src_1.default.pokemon.findFirst({
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
exports.pokeranchRoute = pokeranchRoute;
