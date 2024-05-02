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
exports.tournamentReward = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentReward = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const gameRoom = yield src_1.default.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
        include: {
            tournament: {
                include: {
                    activePlayers: true,
                },
            },
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    if (!gameRoom.tournament || !gameRoom.tournament[0])
        throw new AppErrors_1.UnexpectedError('tournament not found');
    const tournament = gameRoom.tournament[0];
    const player = tournament.activePlayers[0];
    const response = {
        message: `*TORNEIO #${tournament.id}* 
    
    ${player.name} vence a disputa.`,
        status: 200,
        data: null,
    };
});
exports.tournamentReward = tournamentReward;
