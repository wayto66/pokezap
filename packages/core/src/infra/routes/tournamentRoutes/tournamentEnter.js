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
exports.tournamentEnter = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentEnter = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const gameRoom = yield prisma.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            tournament: true,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    if (!gameRoom.tournament)
        throw new AppErrors_1.UnexpectedError('tournament not found');
    const tournament = gameRoom.tournament[0];
    if (tournament.active)
        throw new AppErrors_1.UnexpectedError('tournament already started');
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    yield prisma.tournament.update({
        where: {
            id: tournament.id,
        },
        data: {
            activePlayers: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
    return {
        message: `*${data.playerName}* se inscreveu no torneio.`,
        status: 200,
        data: null,
    };
});
exports.tournamentEnter = tournamentEnter;
