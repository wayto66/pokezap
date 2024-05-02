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
exports.inventoryRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const inventoryItems1_1 = require("./items/inventoryItems1");
const inventoryPokemons1_1 = require("./pokemons/inventoryPokemons1");
const subRouteMap = new Map([
    // INVENTORY ITEMS ROUTES
    ['ITEM', inventoryItems1_1.inventoryItems1],
    ['ITEMS', inventoryItems1_1.inventoryItems1],
    ['ITEN', inventoryItems1_1.inventoryItems1],
    ['ITENS', inventoryItems1_1.inventoryItems1],
    ['I', inventoryItems1_1.inventoryItems1],
    // INVENTORY POKEMON ROUTES
    ['POKEMONS', inventoryPokemons1_1.inventoryPokemons1],
    ['POKEMON', inventoryPokemons1_1.inventoryPokemons1],
    ['POKES', inventoryPokemons1_1.inventoryPokemons1],
    ['POKE', inventoryPokemons1_1.inventoryPokemons1],
    ['P', inventoryPokemons1_1.inventoryPokemons1],
]);
const inventoryRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    if (!subRoute)
        throw new AppErrors_1.MissingParametersInventoryRouteError();
    const route = subRouteMap.get(subRoute);
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(subRoute);
    return yield route(data);
});
exports.inventoryRoutes = inventoryRoutes;
//# sourceMappingURL=index.js.map