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
exports.tournamentCreate = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const tournamentStart_1 = require("./tournamentStart");
const tournamentCreate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.playerPhone !== '5516988675837@c.us')
        throw new AppErrors_1.SendEmptyMessageError();
    const [, , , gameRoomIdString] = data.routeParams;
    const zapClient = container.resolve('ZapClientInstance1');
    const gameRoomId = Number(gameRoomIdString);
    if (isNaN(gameRoomId))
        throw new AppErrors_1.UnexpectedError('gameRoomIdString must be a number');
    const gameRoom = yield prisma.gameRoom.findFirst({
        where: {
            id: gameRoomId,
        },
    });
    if (!gameRoom)
        throw new AppErrors_1.RouteNotFoundError('', gameRoomIdString);
    const tournament = yield prisma.tournament.create({
        data: {
            cashPrize: 1000,
            gameroomId: gameRoomId,
            gymLeaderId: 1,
            active: false,
        },
    });
    zapClient.sendMessage(gameRoom.phone, `
  *INSCRIÇÕES PARA O TORNEIO ABERTAS!*

  O torneio se iniciará em breve, para entrar utilize:
  pz. torneio entrar

  [dsb]
  `);
    setTimeout(() => {
        try {
            (0, tournamentStart_1.tournamentStart)(Object.assign(Object.assign({}, data), { routeParams: ['pz', 'torneio', 'start', gameRoomIdString] }));
        }
        catch (e) {
            console.error(e);
        }
    }, 1000 * 20);
    return {
        react: '✔',
        status: 200,
        message: '',
    };
});
exports.tournamentCreate = tournamentCreate;
