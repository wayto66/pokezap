"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBetween3 = void 0;
const getRandomBetween3 = (data) => {
    if (data.obj1[1] + data.obj2[1] + data.obj3[1] > 1)
        return;
    const random = Math.random();
    if (random < data.obj1[1]) {
        return data.obj1[0];
    }
    if (random < data.obj1[1] + data.obj2[1]) {
        return data.obj2[0];
    }
    return data.obj3[0];
};
exports.getRandomBetween3 = getRandomBetween3;
//# sourceMappingURL=getRandomBetween3.js.map