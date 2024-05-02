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
exports.rankRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const catchRanking_1 = require("./catchRanking");
const eloRanking_1 = require("./eloRanking");
const routesMap = new Map([
    // ELO RANKING ROUTES
    ['ELO', eloRanking_1.eloRanking],
    ['RANK', eloRanking_1.eloRanking],
    ['RANKING', eloRanking_1.eloRanking],
    ['MMR', eloRanking_1.eloRanking],
    // CATCH RANKING ROUTES
    ['CAPTURA', catchRanking_1.catchRanking],
    ['CAPTURAS', catchRanking_1.catchRanking],
    ['CATCH', catchRanking_1.catchRanking],
    ['CATCHES', catchRanking_1.catchRanking],
]);
const rankRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersRankRouteError();
    const route = routesMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.rankRoutes = rankRoutes;
//# sourceMappingURL=index.js.map