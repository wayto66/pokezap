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
exports.pokemonRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const teamSet_1 = require("../teamRoutes/teamSet");
const tradePoke1_1 = require("../tradeRoutes/tradePoke/tradePoke1");
const pokemonDropItem_1 = require("./dropItem/pokemonDropItem");
const pokemonEvolve_1 = require("./evolve/pokemonEvolve");
const pokemonHoldItem_1 = require("./holdItem/pokemonHoldItem");
const pokemonInfo1_1 = require("./info/pokemonInfo1");
const pokemonMegaEvolve_1 = require("./megaEvolve/pokemonMegaEvolve");
const pokemonNickname_1 = require("./nickname/pokemonNickname");
const pokemonSell_1 = require("./sell/pokemonSell");
const pokemonSetRole_1 = require("./setRole/pokemonSetRole");
const pokemonSkills_1 = require("./skills/pokemonSkills");
const subRouteMap = new Map([
    // POKEMON INFO ROUTES
    ['INFO', pokemonInfo1_1.pokemonInfo1],
    ['INFORMATION', pokemonInfo1_1.pokemonInfo1],
    ['INDO', pokemonInfo1_1.pokemonInfo1],
    ['I', pokemonInfo1_1.pokemonInfo1],
    // POKEMON TEAM ROUTES
    [
        'TEAM',
        (data) => {
            const newData = Object.assign(Object.assign({}, data), { routeParams: data.routeParams.slice(1, 9999) });
            return (0, teamSet_1.teamSet)(newData);
        },
    ],
    [
        'TIME',
        (data) => {
            const newData = Object.assign(Object.assign({}, data), { routeParams: data.routeParams.slice(1, 9999) });
            return (0, teamSet_1.teamSet)(newData);
        },
    ],
    [
        'EQUIPE',
        (data) => {
            const newData = Object.assign(Object.assign({}, data), { routeParams: data.routeParams.slice(1, 9999) });
            return (0, teamSet_1.teamSet)(newData);
        },
    ],
    // POEKMON SELL ROUTES
    ['SELL', pokemonSell_1.pokemonSell],
    ['VENDER', pokemonSell_1.pokemonSell],
    // POKEMON EVOLVE ROUTES
    ['EVOLVE', pokemonEvolve_1.pokemonEvolve],
    ['EVOLUIR', pokemonEvolve_1.pokemonEvolve],
    // POKEMON MEGA EVOLVE ROUTES
    ['MEGA-EVOLVE', pokemonMegaEvolve_1.pokemonMegaEvolve],
    ['MEGA-EVOLUIR', pokemonMegaEvolve_1.pokemonMegaEvolve],
    ['MEGAEVOLVE', pokemonMegaEvolve_1.pokemonMegaEvolve],
    ['MEGAEVOLUIR', pokemonMegaEvolve_1.pokemonMegaEvolve],
    // POKEMON SKILL ROUTES
    ['SKILL', pokemonSkills_1.pokemonSkills],
    ['SKILLS', pokemonSkills_1.pokemonSkills],
    ['MOVE', pokemonSkills_1.pokemonSkills],
    ['MOVES', pokemonSkills_1.pokemonSkills],
    ['GOLPE', pokemonSkills_1.pokemonSkills],
    ['GOLPES', pokemonSkills_1.pokemonSkills],
    ['PODER', pokemonSkills_1.pokemonSkills],
    ['PODERES', pokemonSkills_1.pokemonSkills],
    // POKEMON GIVE-ITEM ROUTES
    ['GIVE-ITEM', pokemonHoldItem_1.pokemonHoldItem],
    ['HOLD-ITEM', pokemonHoldItem_1.pokemonHoldItem],
    ['GIVEITEM', pokemonHoldItem_1.pokemonHoldItem],
    ['HOLDITEM', pokemonHoldItem_1.pokemonHoldItem],
    // POKEMON REMOVE-ITEM ROUTES
    ['TAKE-ITEM', pokemonDropItem_1.pokemonDropItem],
    ['DROP-ITEM', pokemonDropItem_1.pokemonDropItem],
    ['TAKEITEM', pokemonDropItem_1.pokemonDropItem],
    ['DROPITEM', pokemonDropItem_1.pokemonDropItem],
    // POKEMON NICKNAME ROUTES
    ['NICKNAME', pokemonNickname_1.pokemonNickname],
    ['APELIDO', pokemonNickname_1.pokemonNickname],
    // POKEMON SETROLE ROUTES
    ['SETROLE', pokemonSetRole_1.pokemonSetRole],
    ['SET-ROLE', pokemonSetRole_1.pokemonSetRole],
    ['SETFUNCTION', pokemonSetRole_1.pokemonSetRole],
    ['SET-FUNCTION', pokemonSetRole_1.pokemonSetRole],
    // TRADE
    ['TRADE', tradePoke1_1.tradePoke1],
    ['TROCAR', tradePoke1_1.tradePoke1],
]);
const pokemonRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersPokemonRouteError();
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.pokemonRoutes = pokemonRoutes;
