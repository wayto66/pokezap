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
exports.iGenPlayerAnalysis = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenPlayerAnalysis = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/player_info.png';
    // Load the background image
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    // draw image avatar
    const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/avatars/' + data.playerData.spriteUrl);
    const spriteWidth = 135;
    const spriteHeight = 135;
    const spriteX = 321;
    const spriteY = 105;
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight);
    // write player name
    ctx.font = '21px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(`${data.playerData.name.toUpperCase()}`, 51, 68);
    // write player energy
    ctx.font = '21px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(`Energia: ${data.playerData.energy}`, 335, 68);
    // write player rank
    ctx.font = '31px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(`${data.playerData.elo}`, 356, 407);
    // write player cash
    ctx.font = '31px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`$${data.playerData.cash}`, 406, 330);
    // draw items
    ctx.globalAlpha = 1;
    let j = 0;
    let k = 0;
    const pokeTeam = [
        data.playerData.teamPoke1,
        data.playerData.teamPoke2,
        data.playerData.teamPoke3,
        data.playerData.teamPoke4,
        data.playerData.teamPoke5,
        data.playerData.teamPoke6,
    ];
    for (let i = 0; i < pokeTeam.length; i++) {
        if (i === 3) {
            j++;
            k = 0;
        }
        if (!pokeTeam[i])
            continue;
        const x = 70 + k * 75;
        const y = 111 + j * 75;
        // set up the circle style
        const circleRadius = 25;
        const circleColor = 'rgba(0,0,0,0.33)';
        // draw the circle path
        ctx.beginPath();
        ctx.arc(x + 25, y + 25, circleRadius, 0, Math.PI * 2);
        // fill the circle path with black color
        ctx.fillStyle = circleColor;
        ctx.fill();
        const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(pokeTeam[i].spriteUrl);
        ctx.drawImage(sprite, x - 12, y - 12, 75, 75);
        ctx.font = ' 14px Pokemon';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`lvl: ${pokeTeam[i].level}`, x + 20, y + 65);
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
    (0, fileHelper_1.removeFileFromDisk)(filepath, 5000);
    return filepath;
});
exports.iGenPlayerAnalysis = iGenPlayerAnalysis;
//# sourceMappingURL=iGenPlayerAnalysis.js.map