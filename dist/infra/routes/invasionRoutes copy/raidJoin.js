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
exports.raidJoin = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const raidProgress_1 = require("./raidProgress");
const raidJoin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , raidIdString] = data.routeParams;
    if (!raidIdString)
        throw new AppErrors_1.MissingParametersBattleRouteError();
    const raidId = Number(raidIdString);
    if (isNaN(raidId))
        throw new AppErrors_1.TypeMissmatchError(raidIdString, 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: true,
            gameRooms: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player.name);
    const playerPokemon = yield prismaClient.pokemon.findFirst({
        where: {
            id: player.teamPoke1.id,
        },
        include: {
            baseData: {
                include: {
                    skills: true,
                },
            },
        },
    });
    if (!playerPokemon)
        throw new AppErrors_1.PokemonNotFoundError(player.teamPoke1.id);
    const raid = yield prismaClient.raid.findFirst({
        where: {
            id: raidId,
        },
    });
    if (!raid)
        throw new AppErrors_1.InvasionNotFoundError(raidIdString);
    if (raid.isFinished)
        throw new AppErrors_1.InvasionAlreadyFinishedError();
    if (raid.isInProgress)
        throw new AppErrors_1.SendEmptyMessageError();
    const updatedRaid = yield prismaClient.raid.update({
        where: {
            id: raid.id,
        },
        data: {
            lobbyPokemons: {
                connect: {
                    id: playerPokemon.id,
                },
            },
        },
        include: {
            lobbyPokemons: true,
        },
    });
    if (updatedRaid.lobbyPokemons.length === raid.requiredPlayers) {
        const zapClient = tsyringe_1.container.resolve('ZapClientInstance1');
        yield zapClient.sendMessage(data.groupCode, `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de raid!
      A aventura vai iniciar!`);
        yield prismaClient.raid.update({
            where: {
                id: raid.id,
            },
            data: {
                inInLobby: false,
                isInProgress: true,
            },
        });
        return yield (0, raidProgress_1.raidProgress)(data);
    }
    return {
        message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de raid!`,
        status: 200,
        data: null,
    };
});
exports.raidJoin = raidJoin;
//# sourceMappingURL=raidJoin.js.map