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
exports.marketRoutes = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const marketAnnounce_1 = require("./marketAnnounce");
const marketOffers_1 = require("./marketOffers");
const marketAccept_1 = require("./marketAccept");
const subRouteMap = new Map([
    ['ANNOUNCE', marketAnnounce_1.marketAnnounce],
    ['ANOUNCE', marketAnnounce_1.marketAnnounce],
    ['ANUNCIAR', marketAnnounce_1.marketAnnounce],
    ['OFFER', marketOffers_1.marketOffers],
    ['OFFERS', marketOffers_1.marketOffers],
    ['CHECK', marketOffers_1.marketOffers],
    ['OFERTAS', marketOffers_1.marketOffers],
    ['ACCEPT', marketAccept_1.marketAccept],
    ['ACEITAR', marketAccept_1.marketAccept],
    ['ACEPT', marketAccept_1.marketAccept],
]);
const marketRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersMarketRouteError();
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.marketRoutes = marketRoutes;
