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
exports.catchRanking = void 0;
const tsyringe_1 = require("tsyringe");
const iGenRanking_1 = require("../../../server/modules/imageGen/iGenRanking");
const AppErrors_1 = require("../../errors/AppErrors");
const catchRanking = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
    const sortedPlayers = players.sort((a, b) => {
        const catchesA = [...new Set(a.caughtDexIds)];
        const catchesB = [...new Set(b.caughtDexIds)];
        return catchesB.length - catchesA.length;
    });
    const rankEntries = [];
    for (const player of sortedPlayers) {
        const playerInfo = {
            id: player.id,
            name: player.name,
            value: [...new Set(player.caughtDexIds)].length,
        };
        rankEntries.push(playerInfo);
    }
    const imageUrl = yield (0, iGenRanking_1.iGenRanking)({
        rankEntries,
        rankingTitle: 'Ranking Capturas Únicas',
        playerName: player.name,
        playerValue: [...new Set(player.caughtDexIds)].length.toString(),
    });
    return {
        message: `TOP 10 - Capturas Únicas`,
        status: 200,
        data: null,
        imageUrl,
    };
});
exports.catchRanking = catchRanking;
//# sourceMappingURL=catchRanking.js.map