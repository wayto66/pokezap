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
exports.routeForfeit = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../errors/AppErrors");
const routeForfeit = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const [, , , confirm] = data.routeParams;
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const gameRoom = yield src_1.default.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(player.name, data.groupCode);
    if (!gameRoom.invasorId)
        throw new AppErrors_1.SendEmptyMessageError();
    const invasionSession = yield src_1.default.invasionSession.findFirst({
        where: {
            id: gameRoom.invasorId,
        },
    });
    if (!invasionSession)
        throw new AppErrors_1.InvasionNotFoundError(gameRoom.invasorId);
    if (confirm && confirm === 'CONFIRM') {
        if (player.cash < ((_a = invasionSession.forfeitCost) !== null && _a !== void 0 ? _a : 0))
            throw new AppErrors_1.InsufficientFundsError(player.name, player.cash, (_b = invasionSession.forfeitCost) !== null && _b !== void 0 ? _b : 0);
        yield src_1.default.player.update({
            where: {
                id: player.id,
            },
            data: {
                cash: {
                    decrement: Math.round((_c = invasionSession.forfeitCost) !== null && _c !== void 0 ? _c : 0),
                },
            },
        });
        yield src_1.default.gameRoom.update({
            where: {
                id: gameRoom.id,
            },
            data: {
                invasor: {
                    disconnect: true,
                },
                experience: {
                    decrement: gameRoom.experience * 0.05,
                },
                level: Math.floor(Math.cbrt(gameRoom.experience * 0.95)),
            },
        });
        return {
            message: `A rota foi liberada com sucesso.`,
            status: 200,
            data: null,
        };
    }
    return {
        message: `Deseja pagar $${invasionSession.forfeitCost} e perder 5% de experience da rota para pedir ajuda?`,
        status: 200,
        data: null,
        actions: ['pz. route forfeit confirm'],
    };
});
exports.routeForfeit = routeForfeit;
