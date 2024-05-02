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
exports.shopDisplay = void 0;
const tsyringe_1 = require("tsyringe");
const iGenShop_1 = require("../../../server/modules/imageGen/iGenShop");
const AppErrors_1 = require("../../errors/AppErrors");
const shopDisplay = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
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
    const imageUrl = yield (0, iGenShop_1.iGenShop)({
        items,
    });
    return {
        message: `${data.playerName} acessou PokeMart!
    
    Para comprar um item envie:
    [pz] loja + posição do item + quantidade
    ou buy + nome do item + quantidade`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
    };
});
exports.shopDisplay = shopDisplay;
//# sourceMappingURL=shopDisplay.js.map