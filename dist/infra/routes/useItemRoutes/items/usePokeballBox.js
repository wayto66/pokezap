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
exports.usePokeballBox = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const usePokeballBox = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const item = yield prismaClient.item.findFirst({
        where: {
            baseItem: {
                name: 'pokeball-box',
            },
            ownerId: player.id,
        },
    });
    if (!item || item.amount <= 0)
        throw new AppErrors_1.ItemNotFoundError('pokeball-box');
    const possibleLoots = [
        'sora-ball',
        'magu-ball',
        'tinker-ball',
        'tale-ball',
        'net-ball',
        'yume-ball',
        'moon-ball',
        'dusk-ball',
        'janguru-ball',
    ];
    const beastBallTry = Math.random();
    const beastBall = beastBallTry < 0.02;
    const lootName = beastBall ? 'beast-ball' : possibleLoots[Math.floor(Math.random() * possibleLoots.length)];
    yield prismaClient.$transaction([
        prismaClient.item.upsert({
            create: {
                name: lootName,
                amount: 1,
                ownerId: player.id,
            },
            update: {
                amount: {
                    increment: 1,
                },
            },
            where: {
                ownerId_name: {
                    ownerId: player.id,
                    name: lootName,
                },
            },
        }),
        prismaClient.item.update({
            data: {
                amount: {
                    decrement: 1,
                },
            },
            where: {
                id: item.id,
            },
        }),
    ]);
    const message = beastBall
        ? `⭐🎉⭐ Incrível! *${player.name}* abre o poke-ball-box e recebe uma incrível *${lootName}*! ⭐🎉⭐`
        : `🎉 *${player.name}* abre o poke-ball-box e recebe uma *${lootName}*! 🎉`;
    return {
        message,
        status: 200,
        data: null,
    };
});
exports.usePokeballBox = usePokeballBox;
//# sourceMappingURL=usePokeballBox.js.map