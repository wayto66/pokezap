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
exports.sellItem = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const sellItem = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , itemNameUppercase, amountString, confirm] = data.routeParams;
    if (!itemNameUppercase)
        throw new AppErrors_1.MissingParameterError('Nome do item');
    const itemName = itemNameUppercase.toLowerCase();
    const amount = amountString ? Number(amountString) : 1;
    if (isNaN(amount))
        throw new AppErrors_1.TypeMissmatchError(amountString, 'Número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedItems: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const item = yield prismaClient.item.findFirst({
        where: {
            name: itemName,
            ownerId: player.id,
        },
        include: {
            baseItem: true,
        },
    });
    if (!item)
        throw new AppErrors_1.ItemNotFoundError(itemName);
    if (item.amount < amount)
        throw new AppErrors_1.InsufficientItemAmountError(itemName, item.amount, amount);
    const sellPrice = item.baseItem.npcPrice * amount * 0.8;
    if (data.fromReact && confirm === 'CONFIRM') {
        yield prismaClient.item.update({
            where: {
                id: item.id,
            },
            data: {
                amount: {
                    decrement: amount,
                },
            },
        });
        yield prismaClient.player.update({
            where: {
                id: player.id,
            },
            data: {
                cash: {
                    increment: sellPrice,
                },
            },
        });
        return {
            message: `${data.playerName} vendeu ${amount} ${item.name} por $${sellPrice}.`,
            status: 200,
            data: null,
        };
    }
    return {
        message: `Deseja vender ${amount} ${item.name} por $${sellPrice}?
    👍 - CONFIRMAR`,
        status: 200,
        data: null,
        actions: [`pz. sell item ${item.name} ${amount} confirm`],
    };
});
exports.sellItem = sellItem;
//# sourceMappingURL=sellItem.ts.js.map