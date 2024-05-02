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
exports.verifyTargetChat = void 0;
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../../infra/logger");
const verifyTargetChat = (target) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const gameRooms = yield prismaClient.gameRoom.findMany();
    const gameRoomPhones = gameRooms.map(gameRoom => gameRoom.phone);
    if (gameRoomPhones.includes(target))
        return true;
    const contains = ['5516988675837@c.us', '120363125836784440@g.us', '120363129454231500@g.us'].includes(target);
    logger_1.logger.info(`The bot is trying to connect to chat: ${target}`);
    return contains;
});
exports.verifyTargetChat = verifyTargetChat;
//# sourceMappingURL=verifyTargetChat.js.map