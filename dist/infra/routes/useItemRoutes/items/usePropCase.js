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
exports.usePropCase = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const usePropCase = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
                name: 'prop-case',
            },
            ownerId: player.id,
        },
    });
    if (!item || item.amount <= 0)
        throw new AppErrors_1.ItemNotFoundError('prop-case');
    const topHelds = [
        'soft-sand',
        'mystic-water',
        'magnet',
        'miracle-seed',
        'charcoal',
        'sharp-beak',
        'black-belt',
        'silk-scarf',
        'silver-powder',
        'spell-tag',
        'hard-stone',
        'never-melt-ice',
        'heart-scale',
        'machine-part',
        'dragon-skull',
    ];
    const possibleLoots = [
        'flame-plate',
        'splash-plate',
        'zap-plate',
        'meadow-plate',
        'icicle-plate',
        'fist-plate',
        'toxic-plate',
        'earth-plate',
        'sky-plate',
        'mind-plate',
        'insect-plate',
        'stone-plate',
        'spooky-plate',
        'draco-plate',
        'dread-plate',
        'iron-plate',
        'pixie-plate',
        'normal-gem',
        'fire-gem',
        'water-gem',
        'electric-gem',
        'grass-gem',
        'ice-gem',
        'fighting-gem',
        'poison-gem',
        'ground-gem',
        'flying-gem',
        'psychic-gem',
        'bug-gem',
        'rock-gem',
        'ghost-gem',
        'dragon-gem',
        'dark-gem',
        'steel-gem',
        'fairy-gem',
    ];
    const lootName = possibleLoots[Math.floor(Math.random() * possibleLoots.length)];
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
    return {
        message: `🎉 *${player.name}* abre o prop-case e recebe uma *${lootName}*! 🎉`,
        status: 200,
        data: null,
    };
});
exports.usePropCase = usePropCase;
//# sourceMappingURL=usePropCase.js.map