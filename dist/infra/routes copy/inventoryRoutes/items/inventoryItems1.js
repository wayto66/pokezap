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
exports.inventoryItems1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const iGenInventoryItems_1 = require("../../../../server/modules/imageGen/iGenInventoryItems");
const inventoryItems1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , ...options] = data.routeParams;
    const lastOption = options[options.length - 1];
    const numberPage = () => {
        if (!isNaN(Number(lastOption)))
            return Number(lastOption);
        return 1;
    };
    const typeFilters = options
        .map(value => {
        if (isNaN(Number(value))) {
            if (['BALL', 'BALLS', 'POKEBALL', 'POKEBALLS'].includes(value))
                return 'standard-balls special-balls';
            if (['PLATE', 'PLATES'].includes(value))
                return 'plates';
            if (['GEM', 'GEMS', 'JEWEL'].includes(value))
                return 'jewels';
        }
    })
        .filter(value => value !== undefined)
        .join(' ')
        .split(' ')
        .filter(value => value !== '');
    console.log({ typeFilters });
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedItems: {
                where: {
                    amount: {
                        gt: 0,
                    },
                    baseItem: {
                        type: {
                            in: typeFilters.length > 0 ? typeFilters : undefined,
                        },
                    },
                },
                skip: Math.max(0, (numberPage() - 1) * 19),
                take: 19,
                include: {
                    baseItem: true,
                },
            },
            ownedPokemons: {
                include: {
                    baseData: true,
                    heldItem: {
                        include: {
                            baseItem: true,
                        },
                    },
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const imageUrl = yield (0, iGenInventoryItems_1.iGenInventoryItems)({
        playerData: player,
    });
    const validItems = player.ownedItems.filter(item => item.amount > 0);
    const itemNameArray = [];
    for (const item of validItems) {
        itemNameArray.push(item.name);
    }
    return {
        message: `Inventário de *${player.name} - página ${numberPage()}* \n \n ${itemNameArray.join(', ')} \n\n👍 - Próxima página.`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [`pz. inventory item ${numberPage() + 1}`],
    };
});
exports.inventoryItems1 = inventoryItems1;
//# sourceMappingURL=inventoryItems1.js.map