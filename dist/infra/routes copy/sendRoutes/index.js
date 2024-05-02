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
exports.sendRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const sendCash_1 = require("./sendCash");
const sendItem_1 = require("./sendItem");
const sendPoke_1 = require("./sendPoke");
const routesMap = new Map([
    ['POKE', sendPoke_1.sendPoke],
    ['POKES', sendPoke_1.sendPoke],
    ['POKEMON', sendPoke_1.sendPoke],
    ['POKEMONS', sendPoke_1.sendPoke],
    ['POKÉMON', sendPoke_1.sendPoke],
    ['POKÉMONS', sendPoke_1.sendPoke],
    ['ITEN', sendItem_1.sendItem],
    ['ITENS', sendItem_1.sendItem],
    ['ITEM', sendItem_1.sendItem],
    ['ITEMS', sendItem_1.sendItem],
    ['CASH', sendCash_1.sendCash],
    ['CASHES', sendCash_1.sendCash],
    ['POKECOIN', sendCash_1.sendCash],
    ['POKECOINS', sendCash_1.sendCash],
    ['DINHEIRO', sendCash_1.sendCash],
    ['MOEDA', sendCash_1.sendCash],
    ['MOEDAS', sendCash_1.sendCash],
]);
const sendRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRouteName] = data.routeParams;
    if (!subRouteName)
        throw new AppErrors_1.MissingParametersSendRouteError();
    const route = routesMap.get(subRouteName);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRouteName);
    return yield route(data);
});
exports.sendRoutes = sendRoutes;
//# sourceMappingURL=index.js.map