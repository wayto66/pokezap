"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findKeyByValue = void 0;
function findKeyByValue(map, value) {
    for (const [key, val] of map) {
        if (val === value) {
            return key;
        }
    }
    return undefined;
}
exports.findKeyByValue = findKeyByValue;
//# sourceMappingURL=findKeyByValue.js.map