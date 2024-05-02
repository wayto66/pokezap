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
exports.daycareIn = void 0;
const getHoursDifference_1 = require("../../../server/helpers/getHoursDifference");
const getPokemonRequestData_1 = require("../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../errors/AppErrors");
const daycareIn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const [, , , , pokemonIdString] = data.routeParams;
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
    const route = yield prisma.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            upgrades: {
                include: {
                    base: true,
                },
            },
            players: {
                include: {
                    ownedPokemons: true,
                },
            },
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!route.upgrades.map(upg => upg.base.name).includes('daycare'))
        throw new AppErrors_1.RouteDoesNotHaveUpgradeError('daycare');
    if (route.players.map(player => player.ownedPokemons.filter(poke => poke.isInDaycare === true)).flat().length >= 9)
        throw new AppErrors_1.DaycareIsFullError();
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
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    if (!pokemon.isAdult)
        throw new AppErrors_1.PokemonHasNotBornYetError(pokemon.id);
    if (pokemon.isInDaycare) {
        if (!pokemon.daycareEntry)
            throw new AppErrors_1.UnexpectedError('Pokemon está no daycare e não possui registro de entrada.');
        const hoursLeft = (0, getHoursDifference_1.getHoursDifference)(pokemon.daycareEntry, new Date());
        throw new AppErrors_1.PokemonInDaycareRemainingTime(pokemon.id, pokemon.baseData.name, hoursLeft.toFixed(2));
    }
    if (pokemon.level >= route.level / 2)
        throw new AppErrors_1.PokemonAboveDaycareLevelLimit(pokemon.id, pokemon.baseData.name, route.level);
    if ([
        (_a = player.teamPoke1) === null || _a === void 0 ? void 0 : _a.id,
        (_b = player.teamPoke2) === null || _b === void 0 ? void 0 : _b.id,
        (_c = player.teamPoke3) === null || _c === void 0 ? void 0 : _c.id,
        (_d = player.teamPoke4) === null || _d === void 0 ? void 0 : _d.id,
        (_e = player.teamPoke5) === null || _e === void 0 ? void 0 : _e.id,
        (_f = player.teamPoke6) === null || _f === void 0 ? void 0 : _f.id,
    ].includes(pokemon.id))
        throw new AppErrors_1.CantProceedWithPokemonInTeamError(pokemon.id, pokemon.baseData.name);
    yield prisma.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            isInDaycare: true,
            daycareEntry: new Date(),
        },
    });
    return {
        message: `*${player.name}* colocou #${pokemon.id} ${pokemon.baseData.name} no daycare.`,
        status: 200,
    };
});
exports.daycareIn = daycareIn;
