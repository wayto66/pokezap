"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFonts = void 0;
const canvas_1 = require("canvas");
const registerFonts = () => {
    (0, canvas_1.registerFont)('./src/assets/font/JosefinSans-Bold.ttf', { family: 'Pokemon' });
    (0, canvas_1.registerFont)('./src/assets/font/Righteous.ttf', { family: 'Righteous' });
};
exports.registerFonts = registerFonts;
//# sourceMappingURL=registerFonts.js.map