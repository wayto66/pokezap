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
exports.pokemonEvolve = void 0;
const iGenPokemonAnalysis_1 = require("../../../../../../image-generator/src/iGenPokemonAnalysis");
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const checkEvolutionPermition_1 = require("../../../../server/modules/pokemon/checkEvolutionPermition");
const handleAlolaGalarEvolution_1 = require("../../../../server/modules/pokemon/handleAlolaGalarEvolution");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonEvolve = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString, targetPokemonNameUppercase] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    const targetPokemonName = targetPokemonNameUppercase === null || targetPokemonNameUppercase === void 0 ? void 0 : targetPokemonNameUppercase.toLowerCase();
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedPokemons: true,
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
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemonId, player.name);
    const route = yield prisma.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    const isRegional = (0, handleAlolaGalarEvolution_1.getRegionalEvolutionData)(pokemon.baseData);
    if (isRegional && route.region) {
        const evolutionData = yield (0, handleAlolaGalarEvolution_1.handleAlolaGalarEvolution)({
            pokemon,
            currentRegion: route.region,
        });
        if (!evolutionData.evolved || !evolutionData.pokemon)
            return {
                message: evolutionData.errorMessage || 'Houve um erro na evolução.',
                status: 300,
            };
        const imageUrl = yield (0, iGenPokemonAnalysis_1.iGenPokemonAnalysis)(evolutionData.pokemon);
        return {
            message: `*${pokemon.baseData.name}* evoluiu para *${evolutionData.pokemon.baseData.name}*!`,
            imageUrl,
            status: 200,
            data: null,
        };
    }
    const evolvePoke = yield (0, checkEvolutionPermition_1.checkEvolutionPermition)({
        pokemonId: pokemon.id,
        playerId: player.id,
        preferredPokemonName: targetPokemonName,
    });
    if (evolvePoke && evolvePoke.status === 'evolved' && evolvePoke.message) {
        const evolvedPoke = yield prisma.pokemon.findFirst({
            where: {
                id: pokemon.id,
            },
            include: {
                baseData: true,
            },
        });
        if (!evolvedPoke)
            throw new AppErrors_1.PokemonNotFoundError(pokemon.id);
        const imageUrl = yield (0, iGenPokemonAnalysis_1.iGenPokemonAnalysis)(evolvedPoke);
        return {
            message: evolvePoke.message,
            imageUrl,
            status: 200,
            data: null,
        };
    }
    if (isRegional &&
        !route.region &&
        evolvePoke.message === 'Não foi possível localizar a posição do pokemon na cadeia evolutiva.')
        return {
            message: `Este pokemon parece evoluir apenas em uma certa região.`,
            status: 300,
        };
    if (evolvePoke && evolvePoke.message)
        return {
            message: evolvePoke.message,
            status: 300,
            data: null,
        };
    return {
        message: `Não foi possível evoluir o pokemon: #${pokemon.id} ${pokemon.baseData.name}.`,
        status: 200,
        data: null,
    };
});
exports.pokemonEvolve = pokemonEvolve;
