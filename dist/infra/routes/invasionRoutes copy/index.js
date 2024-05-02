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
exports.raidRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const raidCreate_1 = require("./raidCreate");
const subRouteMap = new Map([
    // START RAID ROUTES
    ['START', raidCreate_1.raidCreate],
    ['INICIAR', raidCreate_1.raidCreate],
    // JOIN RAIND ROUTS
    ['JOIN', undefined],
    ['ENTER', undefined],
    ['ENTRAR', undefined],
]);
const raidRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersInventoryRouteError();
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.raidRoutes = raidRoutes;
//# sourceMappingURL=index.js.map