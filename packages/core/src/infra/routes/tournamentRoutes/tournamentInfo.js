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
exports.tournamentInfo = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const gameRoom = yield prisma.gameRoom.findFirst({
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
    return {
        message: `*TORNEIO #${tournament.id}* 
    
    Jogadores na disputa: 
    ${tournament.activePlayers.map(p => `- *${p.name}*`).join('\n')}`,
        status: 200,
        data: null,
    };
});
exports.tournamentInfo = tournamentInfo;
