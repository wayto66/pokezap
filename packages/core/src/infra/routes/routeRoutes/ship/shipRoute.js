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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipRoute = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const getHoursDifference_1 = require("../../../../server/helpers/getHoursDifference");
const sendMessage_1 = require("../../../../server/helpers/sendMessage");
const AppErrors_1 = require("../../../errors/AppErrors");
const shipRoute = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , regionUppercase] = data.routeParams;
    const route = yield src_1.default.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            activeWildPokemon: true,
            upgrades: {
                include: {
                    base: true,
                },
            },
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    if (!route.upgrades.map(upg => upg.base.name).includes('barco'))
        throw new AppErrors_1.RouteDoesNotHaveUpgradeError('barco');
    if (!regionUppercase)
        throw new AppErrors_1.MissingTravelRegionError();
    const region = regionUppercase.toLowerCase();
    if (!['alola', 'galar', 'return', 'voltar'].includes(region))
        throw new AppErrors_1.MissingTravelRegionError();
    const ship = route.upgrades.find(r => r.base.name === 'barco');
    if (!ship)
        throw new AppErrors_1.UpgradeNotFoundError('barco');
    if (ship.lastUse) {
        const hoursDiff = (0, getHoursDifference_1.getHoursDifference)(ship.lastUse, new Date());
        if (hoursDiff < 1)
            throw new AppErrors_1.AlreadyTravelingError(route.id);
        if (hoursDiff > 1 && hoursDiff < 12)
            throw new AppErrors_1.XIsInCooldownError('Barco', (12 - hoursDiff).toFixed(2));
    }
    if (region === 'return') {
        yield src_1.default.gameRoom.update({
            where: {
                id: route.id,
            },
            data: {
                region: null,
            },
        });
        return {
            message: `Treinadores retornaram à rota ${route.id}.`,
            status: 200,
        };
    }
    yield src_1.default.gameRoom.update({
        where: {
            id: route.id,
        },
        data: {
            region: region,
        },
    });
    setTimeout(() => travelReturn(Object.assign({}, data)), 30 * 60 * 1000);
    return {
        message: `Treinadores da rota ${route.id} à bordo para ${regionUppercase}!`,
        status: 200,
    };
});
exports.shipRoute = shipRoute;
const travelReturn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , regionUppercase] = data.routeParams;
    yield src_1.default.gameRoom.updateMany({
        where: {
            phone: data.groupCode,
        },
        data: {
            region: null,
        },
    });
    (0, sendMessage_1.sendMessage)({ chatId: data.groupCode, content: `A viagem à ${regionUppercase} se encerrou.` });
});
