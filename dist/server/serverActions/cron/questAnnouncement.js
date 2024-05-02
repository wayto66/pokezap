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
exports.questAnnouncement = void 0;
const tsyringe_1 = require("tsyringe");
const questAnnouncement = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const check = yield prismaClient.quest.findFirst();
    if ((check === null || check === void 0 ? void 0 : check.category) !== 'on')
        return;
    const gameRooms = yield prismaClient.gameRoom.findMany({
        where: {
            mode: 'route',
        },
    });
    for (const gameRoom of gameRooms) {
        data.zapClient.sendMessage(gameRoom.phone, '*COMPETIÇÃO DE CAPTURAS ÚNICAS* \n\n Até o final de domingo (21/04), os 5 jogadores do topo do ranking de capturas únicas receberam a premiação! \n\n utilize: pz. rank catch \n\n [dsb]', {});
    }
});
exports.questAnnouncement = questAnnouncement;
//# sourceMappingURL=questAnnouncement.js.map