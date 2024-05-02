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
exports.iGenWildPokemon = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("../../../infra/logger");
const talentIdMap_1 = require("../../../server/constants/talentIdMap");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenWildPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const bg1 = `./src/assets/sprites/UI/hud/duel_bg/${data.pokemon.baseData.type1Name}.png`;
    const bg2 = `./src/assets/sprites/UI/hud/duel_bg/${data.pokemon.baseData.type2Name || data.pokemon.baseData.type1Name}.png`;
    const bgs = [bg1, bg2];
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = bgs[Math.floor(Math.random() * bgs.length)];
    // Load the background image
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Load the sprite image
    const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.pokemon.spriteUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    // Calculate the position of the sprite in the middle of the canvas
    const spriteWidth = 500 * (data.pokemon.isGiant ? 1.5 : 1); // replace with the actual width of the sprite
    const spriteHeight = 500 * (data.pokemon.isGiant ? 1.5 : 1); // replace with the actual height of the sprite
    const spriteX = (canvasWidth - spriteWidth) / 2;
    const spriteY = (canvasHeight - spriteHeight) / 2;
    // Draw the sprite on the canvas
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight);
    const bar = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/hud/pokemon_wild_encounter.png');
    // Calculate the position of the sprite in the middle of the canvas
    const barWidth = 500; // replace with the actual width of the bar
    const barHeight = 500; // replace with the actual height of the bar
    const barX = 0;
    const barY = 0;
    // Draw the bar on the canvas
    ctx.globalAlpha = 0.8;
    ctx.drawImage(bar, barX, barY, barWidth, barHeight);
    ctx.globalAlpha = 1;
    const typeLabel1 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + data.pokemon.baseData.type1Name + '.png');
    // Calculate the position of the sprite in the middle of the canvas
    const typeLabel1Width = 100; // replace with the actual width of the typeLabel1
    const typeLabel1Height = 31; // replace with the actual height of the typeLabel1
    const typeLabel1X = canvas.width - 100;
    const typeLabel1Y = 105;
    // Draw the typeLabel1 on the canvas
    ctx.globalAlpha = 0.8;
    ctx.drawImage(typeLabel1, typeLabel1X, typeLabel1Y, typeLabel1Width, typeLabel1Height);
    if (data.pokemon.baseData.type2Name) {
        const typeLabel2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + data.pokemon.baseData.type2Name + '.png');
        // Calculate the position of the sprite in the middle of the canvas
        const typeLabel2Width = 100; // replace with the actual width of the typeLabel2
        const typeLabel2Height = 31; // replace with the actual height of the typeLabel2
        const typeLabel2X = canvas.width - 100;
        const typeLabel2Y = 140;
        // Draw the typeLabel2 on the canvas
        ctx.globalAlpha = 1;
        ctx.drawImage(typeLabel2, typeLabel2X, typeLabel2Y, typeLabel2Width, typeLabel2Height);
    }
    if (data.pokemon.isGiant) {
        const giantLabel = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/giant.png');
        // Calculate the position of the sprite in the middle of the canvas
        const giantLabelWidth = 100; // replace with the actual width of the giantLabel
        const giantLabelHeight = 31; // replace with the actual height of the giantLabel
        const giantLabelX = canvas.width - 100;
        const giantLabelY = 175;
        // Draw the giantLabel on the canvas
        ctx.globalAlpha = 1;
        ctx.drawImage(giantLabel, giantLabelX, giantLabelY, giantLabelWidth, giantLabelHeight);
    }
    // write pokemon name
    const name = `#${data.pokemon.id} ${data.pokemon.baseData.name.toUpperCase()} `;
    ctx.font = 30 - name.length / 3 + 'px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(name, 10, 70);
    // write pokemon level
    ctx.font = ' 50px Pokemon';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`${data.pokemon.level}
 `, 450, 65);
    ctx.font = ' 20px Pokemon';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(`level
 `, 450, 85);
    // set up the table data
    const tableData = [
        [data.pokemon.hp.toString(), data.pokemon.atk.toString(), data.pokemon.def.toString()],
        [data.pokemon.speed.toString(), data.pokemon.spAtk.toString(), data.pokemon.spDef.toString()],
    ];
    // set up the table style
    const cellWidth = 80;
    const cellHeight = 55;
    const cellColor = '#212427';
    const cellFont = '15px Pokemon';
    // move the entire table to a new position
    const tableX = 290;
    const tableY = 412;
    // draw the table data
    ctx.fillStyle = cellColor;
    ctx.font = cellFont;
    for (let i = 0; i < tableData.length; i++) {
        const rowData = tableData[i];
        for (let j = 0; j < rowData.length; j++) {
            const cellText = rowData[j];
            const x = tableX + j * cellWidth;
            const y = tableY + i * cellHeight;
            ctx.fillText(cellText, x, y);
        }
    }
    // draw talents
    const getTalent = (name) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/circle/' + name + '.png');
    });
    const talents = [
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId1),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId2),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId3),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId4),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId5),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId6),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId7),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId8),
        talentIdMap_1.talentIdMap.get(data.pokemon.talentId9),
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
            const talent = talents[i * 3 + j];
            if (!talent) {
                logger_1.logger.error('invalid talents: ' + [i * 3 + j]);
                return;
            }
            ctx.drawImage(yield getTalent(talent), x, y, 30, 30);
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
    (0, fileHelper_1.removeFileFromDisk)(filepath, 60000);
    return filepath;
});
exports.iGenWildPokemon = iGenWildPokemon;
//# sourceMappingURL=iGenWildPokemon.js.map