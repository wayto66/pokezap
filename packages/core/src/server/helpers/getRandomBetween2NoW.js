"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomBetween2NoW = void 0;
const getRandomBetween2NoW = (x, y) => {
    const random = Math.random();
    if (random < 0.5)
        return x;
    return y;
};
exports.getRandomBetween2NoW = getRandomBetween2NoW;
