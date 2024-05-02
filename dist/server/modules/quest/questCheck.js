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
exports.questCheck = void 0;
const tsyringe_1 = require("tsyringe");
const questCheck = ({ player, requestedAmount, requestedElement, }) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0); // Set the time to midnight
    const pokemonsDefeatedToday = yield prismaClient.pokemon.findMany({
        where: {
            createdAt: {
                gte: today, // Filter for records created on or after today
            },
            defeatedBy: {
                some: {
                    id: player.id,
                },
            },
            baseData: {
                OR: [{ type1Name: requestedElement }, { type2Name: requestedElement }],
            },
        },
    });
    const defeatedAmount = pokemonsDefeatedToday.length || 0;
    if (defeatedAmount >= requestedAmount)
        return {
            done: true,
        };
    return {
        done: false,
        remaining: requestedAmount - defeatedAmount,
    };
});
exports.questCheck = questCheck;
//# sourceMappingURL=questCheck.js.map