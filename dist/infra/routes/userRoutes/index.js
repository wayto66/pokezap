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
exports.playerRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const playerInfo1_1 = require("./info/playerInfo1");
const playerCash_1 = require("./playerCash");
const playerEnergy_1 = require("./playerEnergy");
const routesMap = new Map([
    ['INFO', playerInfo1_1.playerInfo1],
    ['INDO', playerInfo1_1.playerInfo1],
    ['CASH', playerCash_1.playerCash],
    ['ENERGY', playerEnergy_1.playerEnergy],
]);
const playerRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let [, , subRouteName] = data.routeParams;
    if (!subRouteName)
        subRouteName = 'INFO';
    const route = routesMap.get(subRouteName);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRouteName);
    return yield route(data);
});
exports.playerRoutes = playerRoutes;
//# sourceMappingURL=index.js.map