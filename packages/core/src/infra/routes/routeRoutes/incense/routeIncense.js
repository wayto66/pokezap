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
exports.routeIncense = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const pokemonTypes_1 = require("../../../../server/constants/pokemonTypes");
const AppErrors_1 = require("../../../errors/AppErrors");
const routeIncense = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , givenIncenseName, element1, element2, element3, element4, element5, element6] = data.routeParams;
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
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const incenseItem = yield src_1.default.item.findFirst({
        where: {
            ownerId: player.id,
            baseItem: {
                name: incenseName,
            },
        },
    });
    const route = yield src_1.default.gameRoom.findFirst({
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
    const updatedRoute = yield src_1.default.gameRoom.update({
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
    yield src_1.default.item.update({
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
