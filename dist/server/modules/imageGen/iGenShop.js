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
exports.iGenShop = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenShop = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/shop1.png';
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
    for (let i = 0; i < data.items.length; i++) {
        if (i === 5 || i === 10 || i === 15) {
            j++;
            k = 0;
        }
        const x = 60 + k * 82.5;
        const y = 40 + j * 110;
        // set up the circle style
        const circleRadius = 25;
        const circleColor = 'rgba(0,0,0,0.33)';
        // draw the circle path
        ctx.beginPath();
        ctx.arc(x + 25, y + 25, circleRadius, 0, Math.PI * 2);
        // fill the circle path with black color
        ctx.fillStyle = circleColor;
        ctx.fill();
        const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.items[i].spriteUrl);
        ctx.drawImage(sprite, x, y, 50, 50);
        ctx.font = ' 20px Pokemon';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`$${data.items[i].npcPrice}`, x + 20, y + 80);
        // draw itemid circle
        const circle2Radius = 12;
        // draw the circle path
        ctx.beginPath();
        ctx.arc(x, y, circle2Radius, 0, Math.PI * 2);
        // fill the circle path with black color
        ctx.fillStyle = circleColor;
        ctx.fill();
        ctx.font = ' 20px Pokemon';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`${i + 1}`, x + 0, y + 7);
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
exports.iGenShop = iGenShop;
//# sourceMappingURL=iGenShop.js.map