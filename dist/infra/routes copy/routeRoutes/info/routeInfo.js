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
exports.routeInfo = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const iGenRouteInfo_1 = require("../../../../server/modules/imageGen/iGenRouteInfo");
const routeInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , routeId] = data.routeParams;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    if (!routeId) {
        const route = yield prismaClient.gameRoom.findFirst({
            where: {
                phone: data.groupCode,
            },
            include: {
                upgrades: {
                    include: {
                        base: true,
                    },
                },
                players: true,
            },
        });
        if (!route)
            throw new AppErrors_1.InvalidRouteError();
        const imageUrl = yield (0, iGenRouteInfo_1.iGenRouteInfo)({
            route,
        });
        return {
            message: `Rota ${route.id}
Nível: ${route.level}
Residentes: ${route.players.length}
Upgrades: ${route.upgrades.length}
Visitantes: 0
Cargas de incenso: ${route.incenseCharges || 0}`,
            status: 200,
            data: null,
            imageUrl,
        };
    }
    if (typeof Number(routeId) !== 'number')
        throw new AppErrors_1.TypeMissmatchError(routeId, 'number');
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            id: Number(routeId),
        },
        include: {
            upgrades: true,
            players: true,
        },
    });
    if (!route)
        throw new AppErrors_1.SubRouteNotFoundError(routeId);
    return {
        message: `DUMMY: route found:
      Rota ${route.id}
      level: ${route.level}
      players: ${route.players.length}
      upgrades: ${route.upgrades.length}`,
        status: 200,
        data: null,
    };
});
exports.routeInfo = routeInfo;
//# sourceMappingURL=routeInfo.js.map