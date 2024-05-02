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
exports.tournamentRoutes = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentCreate_1 = require("./tournamentCreate");
const tournamentDuel_1 = require("./tournamentDuel");
const tournamentDuelAccept_1 = require("./tournamentDuelAccept");
const tournamentEnter_1 = require("./tournamentEnter");
const tournamentInfo_1 = require("./tournamentInfo");
const tournamentStart_1 = require("./tournamentStart");
const subRouteMap = new Map([
    // JOIN RAIND ROUTS
    ['CREATE', tournamentCreate_1.tournamentCreate],
    ['ENTRAR', tournamentEnter_1.tournamentEnter],
    ['ENTER', tournamentEnter_1.tournamentEnter],
    ['E', tournamentEnter_1.tournamentEnter],
    ['INFO', tournamentInfo_1.tournamentInfo],
    ['I', tournamentInfo_1.tournamentInfo],
    ['DUEL', tournamentDuel_1.tournamentDuel],
    ['DUEL-ACCEPT', tournamentDuelAccept_1.tournamentDuelAccept],
    ['START', tournamentStart_1.tournamentStart],
]);
const tournamentRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        return {
            message: `Bem vindo à rota de TORNEIO!  [dsb]
     

      👍 - Ver informações do torneio atual
      ❤ - Entrar no torneio `,
            status: 200,
            actions: ['pz. torneio info', 'pz. torneio enter'],
        };
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.tournamentRoutes = tournamentRoutes;
