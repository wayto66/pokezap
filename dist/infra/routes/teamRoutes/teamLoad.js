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
exports.teamLoad = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const teamLoad = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , teamNameUppercase] = data.routeParams;
    if (!teamNameUppercase)
        throw new AppErrors_1.MissingParameterError('Nome do time');
    const teamName = teamNameUppercase.toLowerCase();
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const pokeTeam = yield prismaClient.pokeTeam.findUnique({
        where: {
            name_ownerId: {
                name: teamName,
                ownerId: player.id,
            },
        },
    });
    if (!pokeTeam)
        throw new AppErrors_1.PokeTeamNotFoundError(teamName);
    const pokemonsInTeam = yield prismaClient.pokemon.findMany({
        where: {
            id: {
                in: pokeTeam.pokeIds,
            },
        },
    });
    for (const pokemon of pokemonsInTeam) {
        if (pokemon.ownerId !== player.id)
            throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    }
    yield prismaClient.player.update({
        where: {
            id: player.id,
        },
        data: {
            teamPokeId1: pokeTeam.slot1Id,
            teamPokeId2: pokeTeam.slot2Id,
            teamPokeId3: pokeTeam.slot3Id,
            teamPokeId4: pokeTeam.slot4Id,
            teamPokeId5: pokeTeam.slot5Id,
            teamPokeId6: pokeTeam.slot6Id,
        },
    });
    return {
        message: '',
        react: '👌',
        status: 200,
    };
});
exports.teamLoad = teamLoad;
//# sourceMappingURL=teamLoad.js.map