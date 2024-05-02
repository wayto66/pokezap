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
exports.battleRoutes = void 0;
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const battleWildPokemon_1 = require("./battleWildPokemon");
const battleRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , idString] = data.routeParams;
    if (!idString)
        throw new AppErrors_1.MissingParametersBattleRouteError();
    const id = Number(idString);
    if (isNaN(id))
        throw new AppErrors_1.TypeMissmatchError(idString, 'número');
    return yield (0, battleWildPokemon_1.battleWildPokemon)(data);
});
exports.battleRoutes = battleRoutes;
//# sourceMappingURL=index.js.map