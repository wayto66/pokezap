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
exports.eloRanking = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const iGenRanking_1 = require("../../../server/modules/imageGen/iGenRanking");
const eloRanking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const players = yield prismaClient.player.findMany();
    if (!players)
        throw new AppErrors_1.UnexpectedError('ELO RANKING');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const sortedPlayers = players.sort((a, b) => b.elo - a.elo);
    const rankEntries = [];
    for (const player of sortedPlayers) {
        const playerInfo = {
            id: player.id,
            name: player.name,
            value: player.elo,
        };
        rankEntries.push(playerInfo);
    }
    const imageUrl = yield (0, iGenRanking_1.iGenRanking)({
        rankEntries,
        rankingTitle: 'Ranking ELO',
        playerName: player.name,
        playerValue: player.elo.toString(),
    });
    return {
        message: `TOP 10 - Elo Ranking`,
        status: 200,
        data: null,
        imageUrl,
    };
});
exports.eloRanking = eloRanking;
//# sourceMappingURL=eloRanking.js.map