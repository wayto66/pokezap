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
exports.routeStart = void 0;
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const routeStart = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const route = yield prisma.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (route)
        throw new AppErrors_1.RouteAlreadyRegisteredError();
    const newRoute = yield prisma.gameRoom.create({
        data: {
            level: 1,
            experience: 0,
            mode: 'private',
            phone: data.groupCode,
            incenseCharges: 0,
            players: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
    return {
        message: `O grupo atual foi registrado com sucesso como: ROTA ${newRoute.id}`,
        status: 200,
        data: null,
    };
});
exports.routeStart = routeStart;
