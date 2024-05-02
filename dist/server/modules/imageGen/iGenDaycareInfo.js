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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iGenDaycareInfo = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenDaycareInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { pokemons } = data;
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/daycare.png';
    // Load the background image
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    let j = 0;
    let k = 0;
    for (let i = 0; i < pokemons.length; i++) {
        if (i === 3 || i === 6 || i === 9) {
            j++;
            k = 0;
        }
        const x = 60 + k * 140;
        const y = 45 + j * 145;
        const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(pokemons[i].spriteUrl);
        ctx.drawImage(sprite, x, y, 90, 90);
        const hoursLeft = data.remainingHoursMap.get(pokemons[i].id);
        if (!hoursLeft)
            continue;
        const message = hoursLeft < 0 ? 'PRONTO' : (hoursLeft === null || hoursLeft === void 0 ? void 0 : hoursLeft.toFixed(2)) + 'h';
        ctx.font = ' 13px Pokemon';
        ctx.fillStyle = hoursLeft < 0 ? 'green' : 'white';
        ctx.textAlign = 'start';
        ctx.fillText(`#${pokemons[i].id} - ${message}`, x, y + 95);
        k++;
    }
    const filepath = yield new Promise(resolve => {
        // Save the canvas to disk
        const filename = `images/image-${Math.random()}.png`;
        const filepath = path_1.default.join(__dirname, filename);
        const out = fs_1.default.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            logger_1.logger.info('The PNG file was created.');
            resolve(filepath);
        });
    });
    (0, fileHelper_1.removeFileFromDisk)(filepath, 11000);
    return filepath;
});
exports.iGenDaycareInfo = iGenDaycareInfo;
//# sourceMappingURL=iGenDaycareInfo.js.map