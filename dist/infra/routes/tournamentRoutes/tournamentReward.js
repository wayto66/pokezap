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
exports.tournamentReward = void 0;
const tsyringe_1 = require("tsyringe");
const sendMessage_1 = require("../../../server/serverActions/message/sendMessage");
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentReward = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            tournament: {
                include: {
                    activePlayers: true,
                },
            },
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    if (!gameRoom.tournament || !gameRoom.tournament[0])
        throw new AppErrors_1.UnexpectedError('tournament not found');
    const tournament = gameRoom.tournament[0];
    const player = tournament.activePlayers[0];
    const response = {
        message: `*TORNEIO #${tournament.id}* 
    
    ${player.name} vence a disputa.`,
        status: 200,
        data: null,
    };
    (0, sendMessage_1.sendMessage)(response, gameRoom.phone);
});
exports.tournamentReward = tournamentReward;
//# sourceMappingURL=tournamentReward.js.map