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
exports.invasionDefendLobbyRoute = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const battleInvasionX2_1 = require("./invasionDefend/battleInvasionX2");
const bossInvasion_1 = require("./invasionDefend/bossInvasion");
const invasionDefendLobbyRoute = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , invasionSessionIdString] = data.routeParams;
    if (!invasionSessionIdString)
        throw new AppErrors_1.MissingParametersBattleRouteError();
    const invasionSessionId = Number(invasionSessionIdString);
    if (isNaN(invasionSessionId))
        throw new AppErrors_1.TypeMissmatchError(invasionSessionIdString, 'número');
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
    const invasionSession = yield prismaClient.invasionSession.findFirst({
        where: {
            id: invasionSessionId,
        },
    });
    if (!invasionSession)
        throw new AppErrors_1.InvasionNotFoundError(invasionSessionIdString);
    if (invasionSession.isFinished)
        throw new AppErrors_1.InvasionAlreadyFinishedError();
    if (invasionSession.isInProgress)
        throw new AppErrors_1.SendEmptyMessageError();
    const updatedInvasionSession = yield prismaClient.invasionSession.update({
        where: {
            id: invasionSession.id,
        },
        data: {
            lobbyPlayers: {
                connect: {
                    id: player.id,
                },
            },
        },
        include: {
            lobbyPlayers: true,
        },
    });
    if (updatedInvasionSession.lobbyPlayers.length === invasionSession.requiredPlayers) {
        const zapClient = tsyringe_1.container.resolve('ZapClientInstance1');
        yield zapClient.sendMessage(data.groupCode, `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!
      A batalha vai iniciar!`);
        if (updatedInvasionSession.mode === 'boss-invasion')
            return yield (0, bossInvasion_1.bossInvasion)(Object.assign(Object.assign({}, data), { routeParams: ['', '', '', updatedInvasionSession.id.toString()] }));
        return yield (0, battleInvasionX2_1.battleInvasionX2)(Object.assign(Object.assign({}, data), { routeParams: ['', '', '', updatedInvasionSession.id.toString()] }));
    }
    return {
        message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!`,
        status: 200,
        data: null,
    };
});
exports.invasionDefendLobbyRoute = invasionDefendLobbyRoute;
//# sourceMappingURL=invasionDefendLobbyRoute.js.map