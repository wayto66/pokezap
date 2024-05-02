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
exports.iGenDuelX2 = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const talentIdMap_1 = require("../../constants/talentIdMap");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenDuelX2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.player1.teamPoke1 || !data.player1.teamPoke2)
        throw new AppErrors_1.UnexpectedError('igenduelx2 teampoke player1');
    if (!data.player2.teamPoke1 || !data.player2.teamPoke2)
        throw new AppErrors_1.UnexpectedError('igenduelx2 teampoke player2');
    // Define the dimensions of the canvas and the background
    const canvasWidth = 500;
    const canvasHeight = 500;
    const backgroundUrl = './src/assets/sprites/UI/hud/duel_x1.png';
    // Load the font file and register it with the canvas
    (0, canvas_1.registerFont)('C:/Users/yuri_/OneDrive/Área de Trabalho/dev shit/PROJETOS/pokezap/POKEZAP/src/assets/font/Righteous.ttf', { family: 'Pokemon' });
    // Load the background image
    const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    // Create a canvas with the defined dimensions
    const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    // Draw the background on the canvas
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    // draw image avatar
    const sprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/avatars/' + data.player1.spriteUrl);
    const spriteWidth = 200;
    const spriteHeight = 200;
    const spriteX = 0;
    const spriteY = 90;
    ctx.drawImage(sprite, spriteX, spriteY, spriteWidth, spriteHeight);
    // write player name
    ctx.font = '21px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(`${data.player1.name.toUpperCase()}`, 5, 55);
    // write player rank
    ctx.font = '14px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(`RANK: ${data.player1.elo}`, 51, 75);
    // draw poke sprite
    const pokeSprite1 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.player1.teamPoke1.spriteUrl);
    ctx.drawImage(pokeSprite1, -30, 275, 200, 200);
    // draw poke sprite
    const pokeSprite1b = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.player1.teamPoke2.spriteUrl);
    ctx.drawImage(pokeSprite1b, 65, 275, 200, 200);
    // write poke id
    ctx.font = '16px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.fillText(`#${data.player1.teamPoke1.id}`, 5, 345);
    ctx.fillText(`#${data.player1.teamPoke2.id}`, 5, 320);
    // draw talents
    const getTalent = (name) => __awaiter(void 0, void 0, void 0, function* () {
        return yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/circle/' + name + '.png');
    });
    const talents = [
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId1),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId2),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId3),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId4),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId5),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId6),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId7),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId8),
        talentIdMap_1.talentIdMap.get(data.player1.teamPoke1.talentId9),
    ];
    ctx.globalAlpha = 1;
    for (let i = 0; i < 9; i++) {
        const x = 5 + i * 20;
        const y = 470;
        const talent = talents[i];
        if (!talent)
            return;
        ctx.drawImage(yield getTalent(talent), x, y, 18, 18);
    }
    /// ////////////// PLAYER 2 /////////////////////////////
    /// ///////////////////////////////////////////////////
    /// ////////////////////////////////////////////////////
    // draw image avatar
    const sprite2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/avatars/' + data.player2.spriteUrl);
    const sprite2Width = 200;
    const sprite2Height = 200;
    const sprite2X = 300;
    const sprite2Y = 90;
    ctx.drawImage(sprite2, sprite2X, sprite2Y, sprite2Width, sprite2Height);
    // write player name
    ctx.font = '21px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'end';
    ctx.fillText(`${data.player2.name.toUpperCase()}`, 495, 55);
    // write player rank
    ctx.font = '14px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'end';
    ctx.fillText(`RANK: ${data.player2.elo}`, 450, 75);
    // draw poke sprite
    const pokeSprite2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.player2.teamPoke1.spriteUrl);
    ctx.drawImage(pokeSprite2, 275, 275, 200, 200);
    // draw poke sprite
    const pokeSprite2b = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(data.player2.teamPoke2.spriteUrl);
    ctx.drawImage(pokeSprite2b, 310, 275, 200, 200);
    // write poke id
    ctx.font = '16px Righteous';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'end';
    ctx.fillText(`#${data.player2.teamPoke1.id}`, 495, 345);
    ctx.fillText(`#${data.player2.teamPoke2.id}`, 495, 320);
    // draw talents
    const talents2 = [
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId1),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId2),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId3),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId4),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId5),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId6),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId7),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId8),
        talentIdMap_1.talentIdMap.get(data.player2.teamPoke1.talentId9),
    ];
    ctx.globalAlpha = 1;
    for (let i = 0; i < 9; i++) {
        const x = 320 + i * 20;
        const y = 470;
        const talent = talents2[i];
        if (!talent)
            return;
        ctx.drawImage(yield getTalent(talent), x, y, 18, 18);
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
    (0, fileHelper_1.removeFileFromDisk)(filepath);
    return filepath;
});
exports.iGenDuelX2 = iGenDuelX2;
//# sourceMappingURL=iGenDuelX2.js.map