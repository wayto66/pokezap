"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBetween2 = void 0;
const getRandomBetween2 = (data) => {
    if (data.obj1[1] + data.obj2[1] > 1)
        return;
    const random = Math.random();
    if (random < data.obj1[1]) {
        return data.obj1[0];
    }
    return data.obj2[0];
};
exports.getRandomBetween2 = getRandomBetween2;
