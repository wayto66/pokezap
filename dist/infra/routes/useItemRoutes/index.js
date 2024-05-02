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
exports.useItemRoutes = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const usePokeballBox_1 = require("./items/usePokeballBox");
const usePropCase_1 = require("./items/usePropCase");
const useRareCandy_1 = require("./items/useRareCandy");
const useTM_1 = require("./items/useTM");
const useTMCase_1 = require("./items/useTMCase");
const itemMap = new Map([
    ['TM', useTM_1.useTM],
    ['POKE-BALL-BOX', usePokeballBox_1.usePokeballBox],
    ['POKEBALL-BOX', usePokeballBox_1.usePokeballBox],
    ['TM-CASE', useTMCase_1.useTMCase],
    ['PROPCASE', usePropCase_1.usePropCase],
    ['PROP-CASE', usePropCase_1.usePropCase],
    ['RARE-CANDY', useRareCandy_1.useRareCandy],
]);
const useItemRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , itemName] = data.routeParams;
    if (!itemName)
        throw new AppErrors_1.MissingParametersUseItemRouteError();
    const route = itemMap.get(itemName);
    if (!route)
        throw new AppErrors_1.NoSubRouteForUseItemRouteError(itemName);
    return yield route(data);
});
exports.useItemRoutes = useItemRoutes;
//# sourceMappingURL=index.js.map