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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cassinoTrade = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../errors/AppErrors");
const cassinoTrade = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [, , , itemNameUppercase, amountString] = data.routeParams;
    if (!itemNameUppercase)
        throw new AppErrors_1.MissingParameterError('nome do item à ser trocado no Bazar.');
    if (!amountString)
        throw new AppErrors_1.MissingParameterError('quantidade do item à ser trocado no Bazar.');
    const itemName = itemNameUppercase.toLowerCase();
    const amount = Number(amountString);
    if (isNaN(amount))
        throw new AppErrors_1.TypeMissmatchError(amountString, 'número');
    const player = (_a = data.player) !== null && _a !== void 0 ? _a : (yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    }));
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const item = yield src_1.default.item.findFirst({
        where: {
            name: itemName,
            ownerId: player.id,
            amount: {
                gte: amount,
            },
        },
        include: {
            baseItem: true,
        },
    });
    if (!item)
        throw new AppErrors_1.PlayerDoesNotHaveItemError(player.name, itemName);
    if (item.baseItem.npcPrice <= 0)
        throw new AppErrors_1.ItemNotEligibleForBazarError();
    const getRewardLevel = () => {
        const random = Math.random();
        if (random > 0.9)
            return 3;
        if (random > 0.84)
            return 2;
        if (random > 0.73)
            return 1.4;
        if (random > 0.63)
            return 1;
        if (random > 0.4)
            return 0.5;
        if (random > 0.25)
            return 0.25;
        return 0.15;
    };
    const possibleRewardItems = yield src_1.default.baseItem.findMany({
        where: {
            npcPrice: {
                lte: Math.round(item.baseItem.npcPrice * getRewardLevel() * amount),
                gt: 0,
            },
        },
    });
    const rewardItem = possibleRewardItems[Math.floor(Math.random() * possibleRewardItems.length)];
    yield src_1.default.item.update({
        where: {
            id: item.id,
        },
        data: {
            amount: {
                decrement: amount,
            },
            ownerId: player.id,
        },
    });
    if (!rewardItem)
        return {
            message: `*${player.name}* trocou ${amount} ${itemName} no Bazar e recebeu: nada! 🤠👌`,
            status: 200,
        };
    const rewardAmount = Math.max(1, Math.round((item.baseItem.npcPrice * getRewardLevel() * amount) / rewardItem.npcPrice));
    yield src_1.default.item.upsert({
        where: {
            ownerId_name: {
                ownerId: player.id,
                name: rewardItem.name,
            },
        },
        update: {
            amount: {
                increment: rewardAmount,
            },
        },
        create: {
            ownerId: player.id,
            name: rewardItem.name,
            amount: rewardAmount,
        },
    });
    return {
        message: `*${player.name}* trocou ${amount} ${itemName} no Cassino e recebeu: ${rewardAmount} ${rewardItem.name}! \n\n 👍 - Re-trocar`,
        status: 200,
        actions: [`pz. cassino play ${rewardItem.name} ${rewardAmount}`],
    };
});
exports.cassinoTrade = cassinoTrade;
