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
exports.routeEnter = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const routeEnter = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const updatedRoute = yield src_1.default.gameRoom.update({
        where: {
            phone: data.groupCode,
        },
        data: {
            players: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
    return {
        message: `*${player.name}* acaba de se tornar residente da *ROTA ${updatedRoute.id}!*`,
        status: 200,
        data: null,
    };
});
exports.routeEnter = routeEnter;
