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
exports.duelRoutes = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const duelAccept_1 = require("./duelAccept");
const duelAcceptX2_1 = require("./duelAcceptX2");
const duelAcceptX6_1 = require("./duelAcceptX6");
const duelRandom_1 = require("./duelRandom");
const duelX1Route_1 = require("./duelX1Route");
const duelX2Route_1 = require("./duelX2Route");
const duelX6Route_1 = require("./duelX6Route");
const subRouteMap = new Map([
    // DUEL X1 ROUTES
    ['X1', duelX1Route_1.duelX1Route],
    // DUEL X2 ROUTES
    ['X2', duelX2Route_1.duelX2Route],
    ['X6', duelX6Route_1.duelX6Route],
    // DUEL ACCEPT ROUTES
    ['ACCEPTX1', duelAccept_1.duelAccept],
    ['ACCEPTX2', duelAcceptX2_1.duelAcceptX2],
    ['ACCEPTX6', duelAcceptX6_1.duelAcceptX6],
    // DUEL RANDOM
    ['RANDOM', duelRandom_1.duelRandom],
]);
const duelRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError('', '');
    // if (gameRoom.mode !== 'duel-raid') throw new RouteForbiddenForDuelRaidError()
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersDuelRouteError();
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.duelRoutes = duelRoutes;
//# sourceMappingURL=index.js.map