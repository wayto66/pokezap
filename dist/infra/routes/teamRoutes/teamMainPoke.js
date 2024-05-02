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
exports.teamMainPoke = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const getPokemonRequestData_1 = require("../../../server/helpers/getPokemonRequestData");
const teamMainPoke = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString] = data.routeParams;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    let searchMode = 'string';
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParameterError('Nome/id do pokemon');
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
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield prismaClient.pokemon.findFirst({
        where: pokemonRequestData.where,
    });
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    const currentTeamIds = [
        ...new Set([
            player.teamPokeId1,
            player.teamPokeId2,
            player.teamPokeId3,
            player.teamPokeId4,
            player.teamPokeId5,
            player.teamPokeId6,
        ]),
    ].filter(value => value !== pokemon.id);
    yield prismaClient.player.update({
        where: { id: player.id },
        data: {
            teamPokeId1: pokemon.id,
            teamPokeId2: currentTeamIds[0],
            teamPokeId3: currentTeamIds[1],
            teamPokeId4: currentTeamIds[2],
            teamPokeId5: currentTeamIds[3],
            teamPokeId6: currentTeamIds[4],
        },
    });
    return {
        message: '',
        react: '👌',
        status: 200,
    };
});
exports.teamMainPoke = teamMainPoke;
//# sourceMappingURL=teamMainPoke.js.map