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
exports.pokemonSell = void 0;
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonSell = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString, confirm] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersBuyAmountError();
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
    if (player.ownedPokemons.length <= 1)
        throw new AppErrors_1.PlayerOnlyHasOnePokemonError(player.name);
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
            teamSlot1: true,
            teamSlot2: true,
            teamSlot3: true,
            teamSlot4: true,
            teamSlot5: true,
            teamSlot6: true,
            owner: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemonId, player.name);
    if (pokemon.teamSlot1 ||
        pokemon.teamSlot2 ||
        pokemon.teamSlot3 ||
        pokemon.teamSlot4 ||
        pokemon.teamSlot5 ||
        pokemon.teamSlot6)
        throw new AppErrors_1.CantSellPokemonInTeamError(pokemon.id);
    const pokemonSellPrice = Math.floor(35 + (Math.pow(pokemon.level, 2) / 150) * 100 + (Math.pow(pokemon.baseData.BaseExperience, 2) / 1200) * 50);
    if (data.fromReact && confirm === 'CONFIRM') {
        yield prisma.pokemon.update({
            where: {
                id: pokemon.id,
            },
            data: {
                owner: {
                    disconnect: true,
                },
                gameRoom: {
                    disconnect: true,
                },
                statusTrashed: true,
            },
        });
        yield prisma.player.update({
            where: {
                id: player.id,
            },
            data: {
                cash: {
                    increment: pokemonSellPrice,
                },
            },
        });
        return {
            message: `${data.playerName} vendeu #${pokemon.id} ${pokemon.baseData.name} por $${pokemonSellPrice}.`,
            status: 200,
            data: null,
        };
    }
    return {
        message: `Deseja vender #${pokemon.id} ${pokemon.baseData.name} por $${pokemonSellPrice}?
    👍 - CONFIRMAR`,
        status: 200,
        data: null,
        actions: [`pz. poke sell ${pokemon.id} confirm`],
    };
});
exports.pokemonSell = pokemonSell;
