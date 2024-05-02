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
exports.daycareOut = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const getHoursDifference_1 = require("../../../../server/helpers/getHoursDifference");
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const handleLevelSet_1 = require("../../../../server/modules/pokemon/handleLevelSet");
const AppErrors_1 = require("../../../errors/AppErrors");
const daycareOut = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , , pokemonIdString] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
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
            upgrades: {
                include: {
                    base: true,
                },
            },
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!route.upgrades.map(upg => upg.base.name).includes('daycare'))
        throw new AppErrors_1.RouteDoesNotHaveUpgradeError('daycare');
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
        onlyAdult: true,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield src_1.default.pokemon.findFirst({
        where: pokemonRequestData.where,
        include: {
            baseData: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    if (!pokemon.isInDaycare)
        throw new AppErrors_1.PokemonNotInDaycareError(pokemon.id, pokemon.baseData.name);
    if (!pokemon.daycareEntry)
        throw new AppErrors_1.UnexpectedError('Pokemon está no daycare e não possui registro de entrada.');
    const hoursLeft = 24 - (0, getHoursDifference_1.getHoursDifference)(pokemon.daycareEntry, new Date());
    if (hoursLeft > 0)
        throw new AppErrors_1.PokemonInDaycareRemainingTime(pokemon.id, pokemon.baseData.name, hoursLeft.toFixed(2));
    const targetLevel = Math.ceil(route.level);
    yield (0, handleLevelSet_1.handleLevelSet)({
        pokemon,
        targetLevel,
        removeFromDaycare: true,
    });
    return {
        message: `#${pokemon.id} ${pokemon.baseData.name} terminou seu dia no daycare e avançou para o nível ${targetLevel}`,
        status: 200,
    };
});
exports.daycareOut = daycareOut;
