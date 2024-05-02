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
exports.teamRoutes = void 0;
const teamLoad_1 = require("./teamLoad");
const teamMainPoke_1 = require("./teamMainPoke");
const teamSave_1 = require("./teamSave");
const teamSet_1 = require("./teamSet");
const routesMap = new Map([
    ['SAVE', teamSave_1.teamSave],
    ['SALVAR', teamSave_1.teamSave],
    ['LOAD', teamLoad_1.teamLoad],
    ['CARREGAR', teamLoad_1.teamLoad],
    ['MAINPOKE', teamMainPoke_1.teamMainPoke],
    ['PRINCIPAL', teamMainPoke_1.teamMainPoke],
    ['MAIN', teamMainPoke_1.teamMainPoke],
    ['MAIN-POKE', teamMainPoke_1.teamMainPoke],
    ['POKE-PRINCIPAL', teamMainPoke_1.teamMainPoke],
]);
const teamRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRouteName] = data.routeParams;
    if (!subRouteName)
        return yield (0, teamSet_1.teamSet)(data);
    const route = routesMap.get(subRouteName);
    if (!route)
        return yield (0, teamSet_1.teamSet)(data);
    return yield route(data);
});
exports.teamRoutes = teamRoutes;
//# sourceMappingURL=index.js.map