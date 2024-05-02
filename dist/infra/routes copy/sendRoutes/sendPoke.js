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
exports.sendPoke = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const getPokemonRequestData_1 = require("../../../server/helpers/getPokemonRequestData");
const sendPoke = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString, targetPlayerIdString] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParameterError('id do pokemon à ser trocado');
    if (!targetPlayerIdString)
        throw new AppErrors_1.MissingParameterError('id do jogador que irá receber o pokemon');
    const targetPlayerId = Number(targetPlayerIdString);
    if (isNaN(targetPlayerId))
        throw new AppErrors_1.TypeMissmatchError(targetPlayerIdString, 'número');
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
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
            teamSlot1: true,
            teamSlot2: true,
            teamSlot3: true,
            teamSlot4: true,
            teamSlot5: true,
            teamSlot6: true,
        },
    });
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemonIdString, player.name);
    if (pokemon.teamSlot1 ||
        pokemon.teamSlot2 ||
        pokemon.teamSlot3 ||
        pokemon.teamSlot4 ||
        pokemon.teamSlot5 ||
        pokemon.teamSlot6)
        throw new AppErrors_1.CantProceedWithPokemonInTeamError(pokemon.id, pokemon.baseData.name);
    const targetPlayer = yield prisma.player.findFirst({
        where: {
            id: targetPlayerId,
        },
    });
    if (!targetPlayer)
        throw new AppErrors_1.PlayerNotFoundError(targetPlayerIdString);
    if (pokemon.ownerId === targetPlayer.id)
        throw new AppErrors_1.UnexpectedError('sendPoke');
    if (targetPlayer.isInRaid)
        throw new AppErrors_1.PlayerInRaidIsLockedError(targetPlayer.name);
    yield prisma.$transaction([
        prisma.marketOffer.updateMany({
            where: {
                OR: [
                    {
                        pokemonDemand: {
                            some: {
                                id: pokemon.id,
                            },
                        },
                    },
                    {
                        pokemonOffer: {
                            some: {
                                id: pokemon.id,
                            },
                        },
                    },
                ],
            },
            data: {
                active: false,
            },
        }),
        prisma.pokemon.update({
            where: {
                id: pokemon.id,
            },
            data: {
                ownerId: targetPlayer.id,
            },
            include: {
                baseData: true,
            },
        }),
    ]);
    return {
        message: `*${player.name}* enviou #${pokemon.id} para *${targetPlayer.name}*.`,
        status: 200,
        data: null,
    };
});
exports.sendPoke = sendPoke;
//# sourceMappingURL=sendPoke.js.map