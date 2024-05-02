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
exports.iGenPokemonBreed = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenPokemonBreed = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/pokemon_breed.png';
    // Load the background image
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    const generatePoke1 = () => __awaiter(void 0, void 0, void 0, function* () {
        // Load the sprite image
        const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.pokemon1.spriteUrl);
        // Calculate the position of the sprite in the middle of the canvas
        const spriteWidth = 275; // replace with the actual width of the sprite
        const spriteHeight = 275; // replace with the actual height of the sprite
        const spriteX = 0;
        const spriteY = 80;
        // Draw the sprite on the canvas
        ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight);
        ctx.globalAlpha = 1;
        const typeLabel1 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + data.pokemon1.baseData.type1Name + '.png');
        // Calculate the position of the sprite in the middle of the canvas
        const typeLabel1Width = 80; // replace with the actual width of the typeLabel1
        const typeLabel1Height = 25; // replace with the actual height of the typeLabel1
        const typeLabel1X = 0;
        const typeLabel1Y = 105;
        // Draw the typeLabel1 on the canvas
        ctx.globalAlpha = 0.8;
        ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height);
        if (data.pokemon1.baseData.type2Name) {
            const typeLabel2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + data.pokemon1.baseData.type2Name + '.png');
            // Calculate the position of the sprite in the middle of the canvas
            const typeLabel2Width = 80; // replace with the actual width of the typeLabel2
            const typeLabel2Height = 25; // replace with the actual height of the typeLabel2
            const typeLabel2X = 0;
            const typeLabel2Y = 140;
            // Draw the typeLabel2 on the canvas
            ctx.globalAlpha = 1;
            ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height);
        }
        // write pokemon name
        const name = data.pokemon1.baseData.name;
        const nameLength = name.length;
        ctx.font = Math.round(30 - nameLength * 0.85) + 'px Righteous';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'start';
        ctx.fillText(`#${data.pokemon1.id} ${data.pokemon1.baseData.name.toUpperCase()}`, 10, 70);
        ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid';
        ctx.lineWidth = 2;
        // draw talents
        const getTalent = (name) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/circle/' + name + '.png');
        });
        const talents = [
            data.pokemon1.talent1.typeName,
            data.pokemon1.talent2.typeName,
            data.pokemon1.talent3.typeName,
            data.pokemon1.talent4.typeName,
            data.pokemon1.talent5.typeName,
            data.pokemon1.talent6.typeName,
            data.pokemon1.talent7.typeName,
            data.pokemon1.talent8.typeName,
            data.pokemon1.talent9.typeName,
        ];
        ctx.globalAlpha = 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const x = 22 + j * 40;
                const y = canvas.height - 180 + i * 60;
                // set up the circle style
                const circleRadius = 14;
                const circleColor = 'rgba(0,0,0,0.5)';
                // draw the circle path
                ctx.beginPath();
                ctx.arc(x + 21, y + 21, circleRadius, 0, Math.PI * 2);
                // fill the circle path with black color
                ctx.fillStyle = circleColor;
                ctx.fill();
                Math.floor(Math.random() * 18);
                ctx.drawImage(yield getTalent(talents[i * 3 + j]), x, y, 30, 30);
            }
        }
    });
    const generatePoke2 = () => __awaiter(void 0, void 0, void 0, function* () {
        // Load the sprite image
        const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.pokemon2.spriteUrl);
        // Calculate the position of the sprite in the middle of the canvas
        const spriteWidth = 275; // replace with the actual width of the sprite
        const spriteHeight = 275; // replace with the actual height of the sprite
        const spriteX = 240;
        const spriteY = 80;
        // Draw the sprite on the canvas
        ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight);
        ctx.globalAlpha = 1;
        const typeLabel1 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + data.pokemon2.baseData.type1Name + '.png');
        // Calculate the position of the sprite in the middle of the canvas
        const typeLabel1Width = 80; // replace with the actual width of the typeLabel1
        const typeLabel1Height = 25; // replace with the actual height of the typeLabel1
        const typeLabel1X = 420;
        const typeLabel1Y = 105;
        // Draw the typeLabel1 on the canvas
        ctx.globalAlpha = 0.8;
        ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height);
        if (data.pokemon2.baseData.type2Name) {
            const typeLabel2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + data.pokemon2.baseData.type2Name + '.png');
            // Calculate the position of the sprite in the middle of the canvas
            const typeLabel2Width = 80; // replace with the actual width of the typeLabel2
            const typeLabel2Height = 25; // replace with the actual height of the typeLabel2
            const typeLabel2X = 420;
            const typeLabel2Y = 140;
            // Draw the typeLabel2 on the canvas
            ctx.globalAlpha = 1;
            ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height);
        }
        // write pokemon name
        const name = data.pokemon2.baseData.name;
        const nameLength = name.length;
        ctx.font = Math.round(30 - nameLength * 0.85) + 'px Righteous';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'start';
        ctx.fillText(`#${data.pokemon2.id} ${name.toUpperCase()}`, 290, 70);
        ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid';
        ctx.lineWidth = 2;
        // draw talents
        const getTalent = (name) => __awaiter(void 0, void 0, void 0, function* () {
            return yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/circle/' + name + '.png');
        });
        const talents = [
            data.pokemon2.talent1.typeName,
            data.pokemon2.talent2.typeName,
            data.pokemon2.talent3.typeName,
            data.pokemon2.talent4.typeName,
            data.pokemon2.talent5.typeName,
            data.pokemon2.talent6.typeName,
            data.pokemon2.talent7.typeName,
            data.pokemon2.talent8.typeName,
            data.pokemon2.talent9.typeName,
        ];
        ctx.globalAlpha = 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const x = 365 + j * 40;
                const y = canvas.height - 180 + i * 60;
                // set up the circle style
                const circleRadius = 14;
                const circleColor = 'rgba(0,0,0,0.5)';
                // draw the circle path
                ctx.beginPath();
                ctx.arc(x + 21, y + 21, circleRadius, 0, Math.PI * 2);
                // fill the circle path with black color
                ctx.fillStyle = circleColor;
                ctx.fill();
                ctx.drawImage(yield getTalent(talents[i * 3 + j]), x, y, 30, 30);
            }
        }
    });
    yield generatePoke1();
    yield generatePoke2();
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
exports.iGenPokemonBreed = iGenPokemonBreed;
//# sourceMappingURL=iGenPokemonBreed.js.map