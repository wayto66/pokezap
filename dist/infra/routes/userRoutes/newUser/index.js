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
exports.register = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const register1_1 = require("./register1");
const register2_1 = require("./register2");
const register4_1 = require("./register4");
const register5_1 = require("./register5");
const register6_1 = require("./register6");
const subRouteMap = new Map([
    // JOIN RAIND ROUTS
    ['1', register1_1.register1],
    ['2', register2_1.register2],
    ['MENINO', register2_1.register2],
    ['MENINA', register2_1.register2],
    ['4', register4_1.register4],
    ['5', register5_1.register5],
    ['6', register6_1.register6],
]);
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , subRoute] = data.routeParams;
    const route = subRouteMap.get(subRoute !== null && subRoute !== void 0 ? subRoute : '????');
    if (route)
        return yield route(data);
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (player)
        throw new AppErrors_1.PlayerAlreadyExists(data.playerName);
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!gameRoom)
        yield prismaClient.gameRoom.create({
            data: {
                level: 1,
                experience: 0,
                phone: data.playerPhone,
                mode: 'private',
            },
        });
    return {
        message: `[d] Bem vindo(a) ao PokeZap! 
    Para começarmos, reaja na minha mensagem com o emoji indicado:
    (Você deve reagir à mensagem, não enviar 👍 na conversa)

    👍 - Reaja com esse exato emoji
    `,
        status: 200,
        actions: ['pokezap. iniciar 1'],
        data: null,
    };
});
exports.register = register;
//# sourceMappingURL=index.js.map