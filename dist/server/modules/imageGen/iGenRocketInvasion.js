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
exports.iGenRocketInvasion = void 0;
const canvas_1 = require("canvas");
const canvasHelper_1 = require("../../helpers/canvasHelper");
const fileHelper_1 = require("../../helpers/fileHelper");
const iGenRocketInvasion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { pokemons } = data;
    const canvas2d = yield (0, canvasHelper_1.createCanvas2d)(1);
    const backgroundImage = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/hud/rocket-invasion.png');
    (0, canvasHelper_1.drawBackground)(canvas2d, backgroundImage);
    yield canvas2d.draw({
        height: 80,
        width: 80,
        positionY: 340,
        positionX: 170,
        image: yield (0, canvas_1.loadImage)((_a = pokemons[0]) === null || _a === void 0 ? void 0 : _a.spriteUrl),
    });
    canvas2d.write({
        fillStyle: 'white',
        font: '11px Pokemon',
        positionX: 190,
        positionY: 420,
        textAlign: 'center',
        text: `lvl-${pokemons[0].level}`,
    });
    yield canvas2d.draw({
        height: 80,
        width: 80,
        positionY: 340,
        positionX: 260,
        image: yield (0, canvas_1.loadImage)((_b = pokemons[1]) === null || _b === void 0 ? void 0 : _b.spriteUrl),
    });
    canvas2d.write({
        fillStyle: 'white',
        font: '11px Pokemon',
        positionX: 280,
        positionY: 420,
        textAlign: 'center',
        text: `lvl-${pokemons[1].level}`,
    });
    const filepath = yield (0, fileHelper_1.saveFileOnDisk)(canvas2d);
    (0, fileHelper_1.removeFileFromDisk)(filepath);
    return filepath;
});
exports.iGenRocketInvasion = iGenRocketInvasion;
//# sourceMappingURL=iGenRocketInvasion.js.map