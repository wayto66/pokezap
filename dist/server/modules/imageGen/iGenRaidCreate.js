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
exports.iGenRaidCreate = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenRaidCreate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasWidth = 500;
    const canvasHeight = 500;
    const { boss, backgroundName, enemyPokemons } = data;
    const hudUrl = './src/assets/sprites/UI/raid/hud.png';
    const backgroundUrl = `./src/assets/sprites/UI/raid/${backgroundName}.png`;
    // Load the hud image
    const hud = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(hudUrl);
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Load the sprite image
    const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(boss.defaultSpriteUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the hud on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(hud, 0, 0, canvasWidth, canvasHeight);
    // Calculate the position of the sprite in the middle of the canvas
    const spriteWidth = 350; // replace with the actual width of the sprite
    const spriteHeight = 350; // replace with the actual height of the sprite
    const spriteX = (canvasWidth - spriteWidth) / 2;
    const spriteY = (canvasHeight - spriteHeight) / 2 - 20;
    // Draw the sprite on the canvas
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight);
    ctx.globalAlpha = 1;
    const typeLabel1 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + boss.type1Name + '.png');
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel1Width = 100; // replace with the actual width of the typeLabel1
    const typeLabel1Height = 31; // replace with the actual height of the typeLabel1
    const typeLabel1X = 0;
    const typeLabel1Y = 105;
    // Draw the typeLabel1 on the canvas
    ctx.globalAlpha = 0.8;
    ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height);
    if (boss.type2Name) {
        const typeLabel2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + boss.type2Name + '.png');
        // Calculate the position of the sprite in the middle of the canvas
        const typeLabel2Width = 100; // replace with the actual width of the typeLabel2
        const typeLabel2Height = 31; // replace with the actual height of the typeLabel2
        const typeLabel2X = 400;
        const typeLabel2Y = 105;
        // Draw the typeLabel2 on the canvas
        ctx.globalAlpha = 1;
        ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height);
    }
    // write boss name
    ctx.font = '31px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`RAID: ${boss.name.toUpperCase()}`, 250, 70);
    ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid';
    const lootImageMap = new Map([]);
    for (const item of data.possibleLoot) {
        lootImageMap.set(item.name, yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(item.spriteUrl));
    }
    for (let i = 0; i < data.possibleLoot.length; i++) {
        const x = 170 + i * 50;
        const y = 415;
        const item = lootImageMap.get(data.possibleLoot[i].name);
        if (!item)
            return;
        ctx.drawImage(item, x, y, 45, 45);
    }
    const pokemonsImageMap = new Map([]);
    for (const pokemon of enemyPokemons) {
        if (pokemonsImageMap.get(pokemon.name))
            continue;
        pokemonsImageMap.set(pokemon.name, yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(pokemon.defaultSpriteUrl));
    }
    for (let i = 0; i < enemyPokemons.length; i++) {
        const x = i < 3 ? 0 : 430;
        const y = i < 3 ? 150 + i * 125 : 150 + (i - 3) * 125;
        const poke = pokemonsImageMap.get(enemyPokemons[i].name);
        if (!poke)
            return;
        ctx.drawImage(poke, x, y, 60, 60);
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
exports.iGenRaidCreate = iGenRaidCreate;
//# sourceMappingURL=iGenRaidCreate.js.map