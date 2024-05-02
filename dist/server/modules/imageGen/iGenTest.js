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
exports.iGenTest = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const iGenTest = () => __awaiter(void 0, void 0, void 0, function* () {
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/ranking.png';
    // Load the background image
    const background = yield (0, canvas_1.loadImage)(backgroundUrl);
    const sprite = yield (0, canvas_1.loadImage)('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png');
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background image onto the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    // Create a canvas for the silhouette
    const silhouetteCanvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const silhouetteCtx = silhouetteCanvas.getContext('2d');
    // Draw the Pokemon sprite image onto the silhouette canvas
    silhouetteCtx.drawImage(sprite, 0, 0, canvasWidth, canvasHeight);
    // Get the pixel data of the silhouette canvas
    const imageData = silhouetteCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
    // Iterate through the pixels and set the inside of the sprite to white
    for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        // Check if the pixel is part of the sprite (non-transparent)
        if (alpha !== 0) {
            // Set the pixel color to white
            data[i] = 255; // Red
            data[i + 1] = 255; // Green
            data[i + 2] = 255; // Blue
            // The alpha value remains unchanged
        }
    }
    // Update the modified pixel data on the silhouette canvas
    silhouetteCtx.putImageData(imageData, 0, 0);
    // Composite the silhouette canvas onto the background canvas
    ctx.drawImage(silhouetteCanvas, 0, 0, canvasWidth, canvasHeight);
    const filepath = yield new Promise(resolve => {
        // Save the canvas to disk
        const filename = `images/image.png`;
        const filepath = path_1.default.join(__dirname, filename);
        const out = fs_1.default.createWriteStream(filepath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);
        out.on('finish', () => {
            logger_1.logger.info('The PNG file was created.');
            resolve(filepath);
        });
    });
    return filepath;
});
exports.iGenTest = iGenTest;
//# sourceMappingURL=iGenTest.js.map