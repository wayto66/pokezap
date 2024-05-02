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
exports.routeRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const daycare_1 = require("./daycare");
const routeEnter_1 = require("./enter/routeEnter");
const routeForfeit_1 = require("./forfeit/routeForfeit");
const routeIncense_1 = require("./incense/routeIncense");
const routeInfo_1 = require("./info/routeInfo");
const routeLock_1 = require("./lock/routeLock");
const pokeranchRoute_1 = require("./pokeranch/pokeranchRoute");
const routeExit_1 = require("./routeExit");
const shipRoute_1 = require("./ship/shipRoute");
const routeStart_1 = require("./start/routeStart");
const routeUpgrade_1 = require("./upgrade/routeUpgrade");
const routeVerify_1 = require("./verify/routeVerify");
const routesMap = new Map([
    // ROUTE ENTER ROUTES
    ['ENTRAR', routeEnter_1.routeEnter],
    ['ENTER', routeEnter_1.routeEnter],
    // ROUTE LEAVE ROUTES
    ['SAIR', routeExit_1.routeExit],
    ['LEAVE', routeExit_1.routeExit],
    ['QUIT', routeExit_1.routeExit],
    ['EXIT', routeExit_1.routeExit],
    // ROUTE UPGRADE ROUTES
    ['UPGRADE', routeUpgrade_1.routeUpgrade],
    // ROUTE INFO ROUTES
    ['INFO', routeInfo_1.routeInfo],
    ['INDO', routeInfo_1.routeInfo],
    // ROUTE START ROUTES
    ['START', routeStart_1.routeStart],
    ['INICIO', routeStart_1.routeStart],
    ['INICIAR', routeStart_1.routeStart],
    // ROUTE USE INCENSE
    ['INCENSE', routeIncense_1.routeIncense],
    ['INCENSO', routeIncense_1.routeIncense],
    // ROUTE LOCK
    ['LOCK', routeLock_1.routeLock],
    ['TRAVAR', routeLock_1.routeLock],
    // ROUTE VERIFY
    ['VERIFY', routeVerify_1.routeVerify],
    ['VERIFICAR', routeVerify_1.routeVerify],
    // ROUTE FORFEIT
    ['RENDER', routeForfeit_1.routeForfeit],
    ['FORFEIT', routeForfeit_1.routeForfeit],
    // POKE-RANCH ROUTES
    ['POKE-RANCH', pokeranchRoute_1.pokeranchRoute],
    ['POKE-RANCHO', pokeranchRoute_1.pokeranchRoute],
    ['POKERANCH', pokeranchRoute_1.pokeranchRoute],
    ['POKERANCHO', pokeranchRoute_1.pokeranchRoute],
    // DAYCARE ROUTES
    ['DAY-CARE', daycare_1.daycareRoutes],
    ['DAYCARE', daycare_1.daycareRoutes],
    // TRAVEL ROUTES
    ['TRAVEL', shipRoute_1.shipRoute],
    ['VIAJAR', shipRoute_1.shipRoute],
    ['VIAGEM', shipRoute_1.shipRoute],
]);
const routeRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersRouteRouteError();
    const route = routesMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.routeRoutes = routeRoutes;
