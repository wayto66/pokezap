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
exports.sendCash = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const sendCash = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , amountString, targetPlayerIdString] = data.routeParams;
    if (!amountString)
        throw new AppErrors_1.MissingParameterError('quantidade a ser enviada');
    if (!targetPlayerIdString)
        throw new AppErrors_1.MissingParameterError('id do jogador que irá receber os pokecoins');
    const amount = Number(amountString);
    const targetPlayerId = Number(targetPlayerIdString);
    if (isNaN(amount))
        throw new AppErrors_1.TypeMissmatchError(amountString, 'número');
    if (isNaN(targetPlayerId))
        throw new AppErrors_1.TypeMissmatchError(targetPlayerIdString, 'número');
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (player.cash < amount)
        throw new AppErrors_1.InsufficientFundsError(player.name, player.cash, amount);
    const targetPlayer = yield prisma.player.findFirst({
        where: {
            id: targetPlayerId,
        },
    });
    if (!targetPlayer)
        throw new AppErrors_1.PlayerNotFoundError(targetPlayerIdString);
    if (targetPlayer.isInRaid)
        throw new AppErrors_1.PlayerInRaidIsLockedError(targetPlayer.name);
    yield prisma.player.update({
        where: {
            id: player.id,
        },
        data: {
            cash: {
                decrement: Math.round(amount),
            },
        },
    });
    yield prisma.player.update({
        where: {
            id: targetPlayer.id,
        },
        data: {
            cash: {
                increment: Math.round(amount),
            },
        },
    });
    return {
        message: `*${player.name}* enviou $${amount} para *${targetPlayer.name}*.`,
        status: 200,
        data: null,
    };
});
exports.sendCash = sendCash;
//# sourceMappingURL=sendCash.js.map