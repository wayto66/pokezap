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
exports.iGenRanking = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const iGenRanking = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { rankEntries, rankingTitle, startOffset, endOffset, playerValue, playerName } = data;
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/ranking.png';
    // Load the background image
    const background = yield (0, canvas_1.loadImage)(backgroundUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    ctx.font = ' 30px Pokemon';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(rankingTitle, 250, 75);
    ctx.font = ' 14px Pokemon';
    ctx.textAlign = 'start';
    for (let i = startOffset || 0; i < Math.min(rankEntries.length, endOffset || 10); i++) {
        ctx.fillText('#' + rankEntries[i].id + ' ' + rankEntries[i].name, 120, 125 + i * 32);
        ctx.fillText(rankEntries[i].value.toString(), 410, 125 + i * 32);
    }
    const playerPosition = rankEntries.findIndex(entry => entry.name === playerName) + 1;
    if (playerName && playerValue) {
        ctx.font = ' 20px Pokemon';
        ctx.fillText(playerPosition.toString(), 45, 466);
        ctx.font = ' 14px Pokemon';
        ctx.fillText(playerName, 120, 466);
        ctx.fillText(playerValue.toString(), 410, 466);
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
exports.iGenRanking = iGenRanking;
//# sourceMappingURL=iGenRanking.js.map