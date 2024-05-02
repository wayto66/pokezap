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
exports.sendItem = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const sendItem = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , itemNameUppercase, amountString, targetPlayerIdString] = data.routeParams;
    if (!itemNameUppercase)
        throw new AppErrors_1.MissingParameterError('nome do item à ser trocado');
    if (!targetPlayerIdString)
        throw new AppErrors_1.MissingParameterError('id do jogador que irá receber o item');
    if (!amountString)
        throw new AppErrors_1.MissingParameterError('quantidade do item');
    const itemName = itemNameUppercase.toLowerCase();
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
    const item = yield prisma.item.findFirst({
        where: {
            ownerId: player.id,
            name: itemName,
        },
    });
    if (!item)
        throw new AppErrors_1.PokemonNotFoundError(itemName);
    if (item.amount < amount)
        throw new AppErrors_1.InsufficientItemAmountError(item.name, item.amount, amount);
    const targetPlayer = yield prisma.player.findFirst({
        where: {
            id: targetPlayerId,
        },
    });
    if (!targetPlayer)
        throw new AppErrors_1.PlayerNotFoundError(targetPlayerIdString);
    if (targetPlayer.isInRaid)
        throw new AppErrors_1.PlayerInRaidIsLockedError(targetPlayer.name);
    if (item.ownerId === targetPlayer.id)
        throw new AppErrors_1.UnexpectedError('O item já pertence à você.');
    yield prisma.item.update({
        where: {
            id: item.id,
        },
        data: {
            amount: {
                decrement: amount,
            },
        },
    });
    let sentItem = yield prisma.item.findFirst({
        where: {
            ownerId: targetPlayer.id,
            name: itemName,
        },
    });
    if (sentItem) {
        sentItem = yield prisma.item.update({
            where: {
                id: sentItem.id,
            },
            data: {
                amount: {
                    increment: amount,
                },
            },
        });
    }
    else {
        sentItem = yield prisma.item.create({
            data: {
                name: itemName,
                ownerId: targetPlayer.id,
                amount: amount,
            },
        });
    }
    return {
        message: `*${player.name}* enviou ${amount} ${sentItem.name} para *${targetPlayer.name}*.`,
        status: 200,
        data: null,
    };
});
exports.sendItem = sendItem;
//# sourceMappingURL=sendItem.js.map