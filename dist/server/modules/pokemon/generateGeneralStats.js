"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeneralStats = void 0;
const generateGeneralStats = (stat, level) => {
    return Math.ceil((((2 * stat + 31 + 252 / 4) * level) / 100 + 5) * (Math.random() * 0.2 + 0.9));
};
exports.generateGeneralStats = generateGeneralStats;
//# sourceMappingURL=generateGeneralStats.js.map