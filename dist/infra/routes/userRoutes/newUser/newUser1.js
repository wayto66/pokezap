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
exports.newUser1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const newUser2_1 = require("./newUser2");
const newUser1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , gender] = data.routeParams;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (player)
        throw new AppErrors_1.PlayerAlreadyExists(data.playerName);
    if (gender) {
        return yield (0, newUser2_1.newUser2)(data);
    }
    console.log('creating private-route for: ', data.playerPhone);
    yield prismaClient.gameRoom.create({
        data: {
            level: 1,
            experience: 0,
            phone: data.playerPhone,
            mode: 'private',
        },
    });
    return {
        message: `Bem vindo(a) ao PokeZap! [dsb]
    Para interagir com o bot, sempre comece sua mensagem com o código "pz. " e separe as palavras com espaço.
    
    Para começar, seu personagem será menino ou menina?
    
👍 - menino
❤ - menina

ATENÇÃO: voce deve reagir com o emoji nesta mensagem que estou enviando.
    `,
        status: 200,
        actions: ['pokezap. iniciar menino', 'pokezap. iniciar menina'],
        data: null,
    };
});
exports.newUser1 = newUser1;
//# sourceMappingURL=newUser1.js.map