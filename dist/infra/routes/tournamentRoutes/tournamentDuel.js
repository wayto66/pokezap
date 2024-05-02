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
exports.tournamentDuel = void 0;
const tsyringe_1 = require("tsyringe");
const iGenDuelX2_1 = require("../../../server/modules/imageGen/iGenDuelX2");
const sendMessage_1 = require("../../../server/serverActions/message/sendMessage");
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentNextRound_1 = require("./tournamentNextRound");
const tournamentDuel = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [, , , tournamentIdString, player1IdString, player2IdString, ...pairs] = data.routeParams;
    if (!player1IdString || !player2IdString)
        return yield (0, tournamentNextRound_1.tournamentNextRound)(data);
    const player1Id = Number(player1IdString);
    const player2Id = Number(player2IdString);
    const tournamentId = Number(tournamentIdString);
    if (typeof player1Id !== 'number')
        throw new AppErrors_1.TypeMissmatchError(player1IdString, 'number');
    if (typeof player2Id !== 'number')
        throw new AppErrors_1.TypeMissmatchError(player2IdString, 'number');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player1 = yield prismaClient.player.findUnique({
        where: {
            id: player1Id,
        },
        include: {
            teamPoke1: {
                include: {
                    baseData: {
                        include: {
                            skills: true,
                        },
                    },
                },
            },
            teamPoke2: {
                include: {
                    baseData: {
                        include: {
                            skills: true,
                        },
                    },
                },
            },
        },
    });
    if (!player1)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player1.teamPoke1 || !player1.teamPoke2)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player1.name);
    if (player1.id === player2Id)
        throw new AppErrors_1.CantDuelItselfError();
    const player2 = yield prismaClient.player.findUnique({
        where: {
            id: player2Id,
        },
        include: {
            teamPoke1: {
                include: {
                    baseData: {
                        include: {
                            skills: true,
                        },
                    },
                },
            },
            teamPoke2: {
                include: {
                    baseData: {
                        include: {
                            skills: true,
                        },
                    },
                },
            },
        },
    });
    if (!player2)
        throw new AppErrors_1.PlayerNotFoundError(player2IdString);
    if (!player2.teamPoke1 || !player2.teamPoke2)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player2.name);
    const newSession = yield prismaClient.session.create({
        data: {
            mode: 'duel-x6',
            creatorId: player1.id,
            invitedId: player2.id,
        },
    });
    const imageUrl = yield (0, iGenDuelX2_1.iGenDuelX2)({
        player1: player1,
        player2: player2,
    });
    const tournament = yield prismaClient.tournament.findUnique({
        where: {
            id: tournamentId,
        },
        include: {
            gameRoom: true,
        },
    });
    const response = {
        message: `*TORNEIO*    
    ${player1.name} enfrenta ${player2.name} em um duelo X6!
    👍 - Aceitar`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [`pz. tournament duel-accept ${newSession.id} ${tournamentId} ${pairs.join(' ')}`],
    };
    (0, sendMessage_1.sendMessage)(response, (_a = tournament === null || tournament === void 0 ? void 0 : tournament.gameRoom.phone) !== null && _a !== void 0 ? _a : '');
});
exports.tournamentDuel = tournamentDuel;
//# sourceMappingURL=tournamentDuel.js.map