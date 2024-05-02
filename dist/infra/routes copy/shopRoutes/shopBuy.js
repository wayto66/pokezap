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
exports.shopBuy = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
const shopBuy = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , itemIdString, itemAmountString] = data.routeParams;
    if (!itemAmountString)
        throw new AppErrors_1.MissingParametersBuyAmountError();
    const itemId = Number(itemIdString);
    const itemName = itemIdString.toLowerCase();
    const itemAmount = Number(itemAmountString);
    const itemIdIsNumber = !isNaN(itemId);
    if (isNaN(itemAmount))
        throw new AppErrors_1.TypeMissmatchError('quantidade do item', 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const items = yield prismaClient.baseItem.findMany({
        where: {
            OR: [
                { name: 'poke-ball' },
                { name: 'great-ball' },
                { name: 'ultra-ball' },
                { name: 'full-incense' },
                { name: 'thunder-stone' },
                { name: 'water-stone' },
                { name: 'fire-stone' },
                { name: 'leaf-stone' },
                { name: 'shiny-incense' },
                { name: 'elemental-incense' },
                { name: 'revive' },
            ],
        },
    });
    if (!items)
        throw new AppErrors_1.NoItemsFoundError();
    const requestedItem = itemIdIsNumber ? items[itemId - 1] : items.find(item => item.name === itemName);
    if (!requestedItem)
        throw new AppErrors_1.RequestedShopItemDoesNotExists(itemIdIsNumber ? itemId : itemName);
    if (requestedItem.npcPrice * itemAmount > player.cash)
        throw new AppErrors_1.InsufficientFundsError(player.name, player.cash, requestedItem.npcPrice * itemAmount);
    let item = itemIdIsNumber
        ? yield prismaClient.item.findFirst({
            where: {
                baseItem: {
                    id: requestedItem.id,
                },
                ownerId: player.id,
            },
        })
        : yield prismaClient.item.findFirst({
            where: {
                baseItem: {
                    name: requestedItem.name,
                },
                ownerId: player.id,
            },
        });
    if (!item) {
        item = yield prismaClient.item.create({
            data: {
                ownerId: player.id,
                amount: itemAmount,
                name: requestedItem.name,
            },
        });
    }
    else {
        item = yield prismaClient.item.update({
            where: {
                id: item.id,
            },
            data: {
                amount: {
                    increment: itemAmount,
                },
            },
        });
    }
    yield prismaClient.player.update({
        where: {
            id: player.id,
        },
        data: {
            cash: {
                decrement: requestedItem.npcPrice * itemAmount,
            },
        },
    });
    return {
        message: `${data.playerName} comprou ${itemAmount} ${item.name} por ${requestedItem.npcPrice * itemAmount}.`,
        status: 200,
        data: null,
    };
});
exports.shopBuy = shopBuy;
//# sourceMappingURL=shopBuy.js.map