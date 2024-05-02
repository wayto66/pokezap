"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHpStat = void 0;
const generateHpStat = (baseHp, level) => {
    return Math.ceil(((2 * baseHp + 31 + 252 / 4) * level) / 100 + level + 10);
};
exports.generateHpStat = generateHpStat;
