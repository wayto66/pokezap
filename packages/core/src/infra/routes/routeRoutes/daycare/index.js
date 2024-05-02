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
exports.daycareRoutes = void 0;
const AppErrors_1 = require("../../../errors/AppErrors");
const daycareIn_1 = require("./daycareIn");
const daycareInfo_1 = require("./daycareInfo");
const daycareOut_1 = require("./daycareOut");
const subRouteMap = new Map([
    // IN ROUTES
    ['IN', daycareIn_1.daycareIn],
    ['ENTER', daycareIn_1.daycareIn],
    ['ENTRAR', daycareIn_1.daycareIn],
    // OUT ROUTES
    ['OUT', daycareOut_1.daycareOut],
    ['LEAVE', daycareOut_1.daycareOut],
    ['SAIR', daycareOut_1.daycareOut],
    // IN ROUTES
    ['INFO', daycareInfo_1.daycareInfo],
]);
const daycareRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParameterError('Ação');
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.daycareRoutes = daycareRoutes;
