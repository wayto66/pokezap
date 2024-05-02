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
exports.admRoutes = void 0;
const npcMarketOffers_1 = require("../../../server/serverActions/cron/npcMarketOffers");
const AppErrors_1 = require("../../errors/AppErrors");
const duelX1Generate_1 = require("./duelX1Generate");
const subRouteMap = new Map([
    ['NMO', npcMarketOffers_1.npcMarketOffers],
    ['DUEL', duelX1Generate_1.duelX1Generate],
]);
const admRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!['5516988675837@c.us', '5516981453197@c.us'].includes(data.playerPhone))
        return {
            react: '💤',
            message: '',
            status: 400,
        };
    if (!subRoute)
        throw new AppErrors_1.MissingParametersMarketRouteError();
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.admRoutes = admRoutes;
//# sourceMappingURL=index.js.map