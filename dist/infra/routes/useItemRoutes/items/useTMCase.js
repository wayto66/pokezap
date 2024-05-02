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
exports.useTMCase = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const useTMCase = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
                name: 'tm-case',
            },
            ownerId: player.id,
        },
    });
    if (!item || item.amount <= 0)
        throw new AppErrors_1.ItemNotFoundError('tm-case');
    const amount = Math.ceil(Math.random() * 3);
    yield prismaClient.$transaction([
        prismaClient.item.upsert({
            create: {
                name: 'tm',
                amount,
                ownerId: player.id,
            },
            update: {
                amount: {
                    increment: amount,
                },
            },
            where: {
                ownerId_name: {
                    ownerId: player.id,
                    name: 'tm',
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
    return {
        message: `🎉 *${player.name}* abre o tm-case e recebe *${amount} TM*! 🎉`,
        status: 200,
        data: null,
    };
});
exports.useTMCase = useTMCase;
//# sourceMappingURL=useTMCase.js.map