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
exports.routeIncense = void 0;
const tsyringe_1 = require("tsyringe");
const pokemonTypes_1 = require("../../../../server/constants/pokemonTypes");
const AppErrors_1 = require("../../../errors/AppErrors");
const routeIncense = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , givenIncenseName, element1, element2, element3, element4, element5, element6] = data.routeParams;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const incenseName = (givenIncenseName || 'full-incense').toLowerCase();
    const elementsPre = [element1, element2, element3, element4, element5, element6];
    const elements = [];
    for (const element of elementsPre) {
        if (!element || typeof element !== 'string')
            continue;
        if (!pokemonTypes_1.pokemonTypes.includes(element.toLowerCase()))
            throw new AppErrors_1.UnexpectedError('Não há um tipo chamado: ' + element);
        if (incenseName === 'elemental-incense')
            elements.push(element.toLowerCase());
    }
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const incenseItem = yield prismaClient.item.findFirst({
        where: {
            ownerId: player.id,
            baseItem: {
                name: incenseName,
            },
        },
    });
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!incenseItem || incenseItem.amount <= 0)
        throw new AppErrors_1.PlayerDoesNotHaveItemError(player.name, incenseName);
    if (route.activeIncense !== incenseName && route.incenseCharges && route.incenseCharges > 0)
        throw new AppErrors_1.RouteHasADifferentIncenseActiveError(incenseName);
    const updatedRoute = yield prismaClient.gameRoom.update({
        where: {
            phone: data.groupCode,
        },
        data: {
            activeIncense: incenseName,
            incenseCharges: {
                increment: 10,
            },
            incenseElements: {
                set: elements,
            },
        },
    });
    yield prismaClient.item.update({
        where: {
            id: incenseItem.id,
        },
        data: {
            amount: {
                decrement: 1,
            },
        },
    });
    return {
        message: `*${player.name}* ativou um incenso na *ROTA ${updatedRoute.id}!*`,
        status: 200,
        data: null,
    };
});
exports.routeIncense = routeIncense;
//# sourceMappingURL=routeIncense.js.map