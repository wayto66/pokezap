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
exports.routeLock = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const routeLock = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , levelLockString] = data.routeParams;
    if (!levelLockString)
        throw new AppErrors_1.MissingParameterError('Nível de trava');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            gameRooms: true,
        },
    });
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!player.gameRooms.map(g => g.id).includes(route.id))
        throw new AppErrors_1.PlayerDoesNotResideOnTheRoute(route.id, player.name);
    if (['REMOVE', 'REMOVER'].includes(levelLockString)) {
        yield prismaClient.gameRoom.update({
            where: {
                id: route.id,
            },
            data: {
                levelLock: null,
            },
        });
        return {
            message: `*${player.name}* removeu o limite de nível de aparição da rota.`,
            status: 200,
            data: null,
        };
    }
    const levelLock = Number(levelLockString);
    if (isNaN(levelLock))
        throw new AppErrors_1.TypeMissmatchError(levelLockString, 'Número');
    if (levelLock > route.level)
        throw new AppErrors_1.UnexpectedError('Levellock maior que o nível atual da rota');
    yield prismaClient.gameRoom.update({
        where: {
            id: route.id,
        },
        data: {
            levelLock: levelLock,
        },
    });
    return {
        message: `*${player.name}* limitou o nível de aparição de pokemons para: ${levelLock}.`,
        status: 200,
        data: null,
    };
});
exports.routeLock = routeLock;
//# sourceMappingURL=routeLock.js.map