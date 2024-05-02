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
exports.iGenRaidNextRoom = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const talentIdMap_1 = require("../../constants/talentIdMap");
const fileHelper_1 = require("../../helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenRaidNextRoom = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasWidth = 500;
    const canvasHeight = 500;
    const { raid, enemyPokemons } = data;
    const backgroundName = raid.imageUrl;
    const hudUrl = './src/assets/sprites/UI/raid/next_room.png';
    const backgroundUrl = `./src/assets/sprites/UI/raid/${backgroundName}.png`;
    // Load the hud image
    const hud = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(hudUrl);
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the hud on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(hud, 0, 0, canvasWidth, canvasHeight);
    ctx.globalAlpha = 1;
    const talentSprites = {};
    for (let i = 0; i < enemyPokemons.length; i++) {
        const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
        const talentNames = ids.map(id => {
            return talentIdMap_1.talentIdMap.get(id);
        });
        for (const talent of talentNames) {
            if (talent && !talentSprites[talent]) {
                talentSprites[talent] = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/circle/' + talent + '.png');
            }
        }
    }
    ctx.font = '31px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`${raid.name.toUpperCase()}`, 250, 70);
    ctx.strokeStyle = 'rgba(0,0,0,0.5) 10px solid';
    for (let i = 0; i < enemyPokemons.length; i++) {
        const x = i < 2 ? 80 : 350;
        const y = i < 2 ? 145 + i * 125 : 290 + (i - 3) * 125;
        const poke = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(enemyPokemons[i].spriteUrl);
        if (!poke)
            return;
        ctx.drawImage(poke, x, y, 90, 90);
        for (let j = 1; j < 10; j++) {
            const talentName = enemyPokemons[i]['talentId' + j];
            if (!talentName) {
                console.log(`no talent name for ${enemyPokemons[i]['talentId' + j]}`);
                continue;
            }
            const image = talentSprites[talentIdMap_1.talentIdMap.get(talentName) || ''];
            if (!image) {
                console.log('no image for talenidmapget: ' + talentIdMap_1.talentIdMap.get(talentName));
                console.log('no image for : ' + talentSprites[talentIdMap_1.talentIdMap.get(talentName) || '']);
            }
            if (image) {
                ctx.drawImage(image, x - 60 + j * 18, y + 80, 17, 17);
            }
        }
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
exports.iGenRaidNextRoom = iGenRaidNextRoom;
//# sourceMappingURL=iGenRaidNextRoom.js.map