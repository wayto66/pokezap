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
exports.adventureRoutes = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const raidCancel_1 = require("./raidCancel");
const raidCreate_1 = require("./raidCreate");
const raidJoin_1 = require("./raidJoin");
const raidRoomSelect_1 = require("./raidRoomSelect");
const raidTeam_1 = require("./raidTeam");
const subRouteMap = new Map([
    // START RAID ROUTES
    ['START', raidCreate_1.raidCreate],
    ['INICIAR', raidCreate_1.raidCreate],
    ['CREATE', raidCreate_1.raidCreate],
    // JOIN RAIND ROUTS
    ['JOIN', raidJoin_1.raidJoin],
    ['ENTER', raidJoin_1.raidJoin],
    ['ENTRAR', raidJoin_1.raidJoin],
    // ROOM SELECT
    ['SELECT', raidRoomSelect_1.raidRoomSelect],
    ['SELECT-ONLYCREATOR', raidRoomSelect_1.raidRoomSelect],
    ['CANCEL', raidCancel_1.raidCancel],
    ['CANCELAR', raidCancel_1.raidCancel],
    ['TEAM', raidTeam_1.raidTeam],
    ['TIME', raidTeam_1.raidTeam],
]);
const adventureRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParameterError('Ação');
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.adventureRoutes = adventureRoutes;
//# sourceMappingURL=index.js.map