"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveClanBonus = void 0;
const getActiveClanBonus = (team) => {
    if (team.length < 6)
        return 'Nenhum';
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('flying') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('dragon'))) {
        return 'Wingeon';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('fire') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('ground'))) {
        return 'Volcanic';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('psychic') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('ghost') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('dark'))) {
        return 'Mastermind';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('electric') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('rock') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('steel'))) {
        return 'Thunderforge';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('fairy') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('grass'))) {
        return 'Wonderleaf';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('poison') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('bug'))) {
        return 'Toxibug';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('normal') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('fighting'))) {
        return 'Gardestrike';
    }
    if (team === null || team === void 0 ? void 0 : team.every(poke => [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('water') ||
        [poke === null || poke === void 0 ? void 0 : poke.baseData.type1Name, poke === null || poke === void 0 ? void 0 : poke.baseData.type2Name].includes('ice'))) {
        return 'Seavell';
    }
    return 'Nenhum';
};
exports.getActiveClanBonus = getActiveClanBonus;
//# sourceMappingURL=getActiveClanBonus.js.map