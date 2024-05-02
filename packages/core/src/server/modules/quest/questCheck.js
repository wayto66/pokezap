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
const questCheck = (_a) => __awaiter(void 0, [_a], void 0, function* ({ player, requestedAmount, requestedElement, }) {
    const today = new Date(); // Get the current date
    today.setHours(0, 0, 0, 0); // Set the time to midnight
    const pokemonsDefeatedToday = yield prisma.pokemon.findMany({
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
