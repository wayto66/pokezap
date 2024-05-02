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
exports.raidCancel = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const raidCancel = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            upgrades: {
                include: {
                    base: true,
                },
            },
            raid: {
                include: {
                    lobbyPokemons: true,
                },
            },
            players: true,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    yield prismaClient.raid.updateMany({
        where: {
            gameRoomId: gameRoom.id,
        },
        data: {
            isFinished: true,
            isInProgress: false,
            inInLobby: false,
            statusTrashed: true,
        },
    });
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    yield prismaClient.player.update({
        where: {
            id: player.id,
        },
        data: {
            isInRaid: false,
        },
    });
    return {
        message: `*${data.playerName}* cancelou a raid atual.`,
        status: 200,
        data: null,
    };
});
exports.raidCancel = raidCancel;
//# sourceMappingURL=raidCancel.js.map