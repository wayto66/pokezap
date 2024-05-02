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
exports.tradeRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const tradePoke1_1 = require("./tradePoke/tradePoke1");
const routesMap = new Map([
    ['POKE', tradePoke1_1.tradePoke1],
    ['POKEMON', tradePoke1_1.tradePoke1],
    ['ITEN', undefined],
    ['ITEM', undefined],
    ['ITENS', undefined],
    ['ITEMS', undefined],
]);
const tradeRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRouteName] = data.routeParams;
    if (!subRouteName)
        throw new AppErrors_1.MissingParametersTradeRouteError();
    const route = routesMap.get(subRouteName);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRouteName);
    return yield route(data);
});
exports.tradeRoutes = tradeRoutes;
//# sourceMappingURL=index.js.map