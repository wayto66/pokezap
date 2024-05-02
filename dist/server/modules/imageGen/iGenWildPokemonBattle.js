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
exports.iGenWildPokemonBattle = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const gifencoder_1 = __importDefault(require("gifencoder"));
const path_1 = __importDefault(require("path"));
const talentIdMap_1 = require("../../constants/talentIdMap");
const fileHelper_1 = require("../../helpers/fileHelper");
const iGenWildPokemonBattle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = yield new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        const { winnerDataName, loserDataName } = data;
        const random = Math.random();
        const rightPokemon = random >= 0.5 ? data.winnerPokemon : data.loserPokemon;
        const leftPokemon = random >= 0.5 ? data.loserPokemon : data.winnerPokemon;
        // Define the dimensions of the canvas and the background
        const canvasWidth = 500;
        const canvasHeight = 500;
        const backgroundUrl = './src/assets/sprites/UI/hud/duel_x1_round.png';
        // Create a canvas with the defined dimensions
        const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        const filepath = path_1.default.join(__dirname, `/images/animation-${Math.random()}.gif`);
        // Create a new GIFEncoder instance
        const encoder = new gifencoder_1.default(500, 500);
        encoder.createReadStream().pipe(fs_1.default.createWriteStream(filepath));
        // draw poke1 sprite
        const rightPokeSprite = yield (0, canvas_1.loadImage)(rightPokemon.spriteUrl);
        // draw poke2 sprite
        const leftPokeSprite = yield (0, canvas_1.loadImage)(leftPokemon.spriteUrl);
        const winnerPokeSkillTypeSprite = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/types/' + data.winnerPokemon.skillType + '.png');
        const loserPokeSkillTypeSprite = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/types/' + data.loserPokemon.skillType + '.png');
        const winnerPokeUltimateTypeSprite = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/types/' + data.winnerPokemon.ultimateType + '.png');
        const loserPokeUltimateTypeSprite = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/types/' + data.loserPokemon.ultimateType + '.png');
        // Load the background image
        const background = yield (0, canvas_1.loadImage)(backgroundUrl);
        // draw talents
        const rightPokemonTalents = [
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId1),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId2),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId3),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId4),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId5),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId6),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId7),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId8),
            talentIdMap_1.talentIdMap.get(rightPokemon.talentId9),
        ];
        const leftPokemonTalents = [
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId1),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId2),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId3),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId4),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId5),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId6),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId7),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId8),
            talentIdMap_1.talentIdMap.get(leftPokemon.talentId9),
        ];
        const talentSprites = {};
        for (const talent of leftPokemonTalents) {
            if (talent && !talentSprites[talent]) {
                talentSprites[talent] = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/types/circle/' + talent + '.png');
            }
        }
        for (const talent of rightPokemonTalents) {
            if (talent && !talentSprites[talent]) {
                talentSprites[talent] = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/types/circle/' + talent + '.png');
            }
        }
        const drawTalents = (talents, xOffset) => __awaiter(void 0, void 0, void 0, function* () {
            if (!talents)
                return;
            for (let j = 0; j < 9; j++) {
                const x = xOffset + j * 22;
                const y = 400;
                // set up the circle style
                const circleRadius = 10;
                const circleColor = 'rgba(0,0,0,0.5)';
                // draw the circle path
                ctx.beginPath();
                ctx.arc(x + 21, y + 21, circleRadius, 0, Math.PI * 2);
                // fill the circle path with black color
                ctx.fillStyle = circleColor;
                ctx.fill();
                const talent = talents[j];
                if (!talent)
                    return;
                ctx.drawImage(talentSprites[talent], x, y, 21, 21);
            }
        });
        // Draw the still part of the animation:
        ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(rightPokeSprite, 285, 165, 250, 250);
        ctx.drawImage(leftPokeSprite, 0, 165, 250, 250);
        // write pokenames
        ctx.font = '14px Righteous';
        ctx.fillText(rightPokemon.baseData.name, 350, 135);
        ctx.fillText(leftPokemon.baseData.name, 65, 135);
        // write pokemon levels
        ctx.font = '14px Righteous';
        ctx.textAlign = 'start';
        ctx.fillText(rightPokemon.level.toString(), 470, 135);
        ctx.fillText(leftPokemon.level.toString(), 200, 135);
        yield drawTalents(rightPokemonTalents, 305);
        yield drawTalents(leftPokemonTalents, 5);
        /// ////////////////////////////////////////////////////////////
        // Convert the canvas to a buffer
        const canvasBuffer = canvas.toBuffer('image/png'); // Specify the desired image format ('image/png' in this example)
        const duelStillImage = yield (0, canvas_1.loadImage)(canvasBuffer);
        // Configure the GIFEncoder
        encoder.start();
        encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
        encoder.setDelay(300); // Delay between frames in milliseconds
        encoder.setQuality(60); // Image quality (lower is better)
        const framesPerRound = 1;
        let round = 1;
        let roundInfo = data.duelMap.get(round);
        let isDuelInProgress = true;
        const winnerHpBarXOffset = random >= 0.5 ? 365 : 55;
        const loserHpBarXOffset = random >= 0.5 ? 55 : 365;
        for (let i = 0; i < data.roundCount * framesPerRound + 40; i++) {
            if (i > round * framesPerRound && isDuelInProgress) {
                round++;
                roundInfo = data.duelMap.get(round);
            }
            if (!roundInfo)
                continue;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(duelStillImage, 0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = `rgb(160,40,40)`;
            ctx.fillRect(winnerHpBarXOffset, 108, Math.max(0, (roundInfo[winnerDataName].hp / roundInfo[winnerDataName].maxHp) * 125), 7);
            ctx.fillStyle = `rgb(160,40,40)`;
            ctx.fillRect(loserHpBarXOffset, 108, Math.max(0, (roundInfo[loserDataName].hp / roundInfo[loserDataName].maxHp) * 125), 7);
            // draw mana
            ctx.fillStyle = `rgb(50,121,211)`;
            ctx.fillRect(loserHpBarXOffset - 55, 145, Math.max(0, (roundInfo[loserDataName].mana / 100) * 175), 3);
            ctx.fillStyle = `rgb(50,121,211)`;
            ctx.fillRect(winnerHpBarXOffset - 55, 145, Math.max(0, (roundInfo[winnerDataName].mana / 100) * 175), 3);
            // write skills
            ctx.font = '18px Righteous';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'start';
            if (i % 6 !== 0) {
                ctx.fillText(roundInfo[loserDataName].currentSkillName, rightPokemon === data.winnerPokemon ? 15 : 315, 480);
                ctx.fillText(roundInfo[winnerDataName].currentSkillName, rightPokemon === data.winnerPokemon ? 315 : 15, 480);
            }
            const getSkillTypeFlag = (pokeData, who) => {
                if (pokeData.currentSkillName === pokeData.skillName) {
                    if (who === 'winner')
                        return winnerPokeSkillTypeSprite;
                    return loserPokeSkillTypeSprite;
                }
                if (who === 'winner')
                    return winnerPokeUltimateTypeSprite;
                return loserPokeUltimateTypeSprite;
            };
            // draw skill types
            if (i % 6 !== 0) {
                ctx.drawImage(getSkillTypeFlag(roundInfo[winnerDataName], 'winner'), rightPokemon === data.winnerPokemon ? 421 : 131, 460, 75, 25);
                ctx.drawImage(getSkillTypeFlag(roundInfo[loserDataName], 'loser'), rightPokemon === data.winnerPokemon ? 131 : 421, 460, 75, 25);
            }
            ctx.font = '32px Righteous';
            ctx.textAlign = 'center';
            ctx.fillText(`Round ${round}`, 250, 52);
            // write crits
            ctx.font = '32px Righteous';
            ctx.fillStyle = 'yellow';
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'start';
            if (roundInfo[winnerDataName].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
                ctx.fillText(`CRITICAL!`, winnerHpBarXOffset, 180);
                ctx.strokeText(`CRITICAL!`, winnerHpBarXOffset, 180);
            }
            if (roundInfo[loserDataName].crit && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
                ctx.fillText(`CRITICAL!`, loserHpBarXOffset, 180);
                ctx.strokeText(`CRITICAL!`, loserHpBarXOffset, 180);
            }
            ctx.fillStyle = 'blue';
            if (roundInfo[winnerDataName].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
                ctx.fillText(`BLOCK!`, winnerHpBarXOffset, 215);
                ctx.strokeText(`BLOCK!`, winnerHpBarXOffset, 215);
            }
            if (roundInfo[loserDataName].block && (isDuelInProgress || i < data.roundCount * framesPerRound)) {
                ctx.fillText(`BLOCK!`, loserHpBarXOffset, 215);
                ctx.strokeText(`BLOCK!`, loserHpBarXOffset, 215);
            }
            ctx.fillStyle = 'white';
            ctx.font = '24px Righteous';
            if (roundInfo[winnerDataName].hasUltimate &&
                roundInfo[winnerDataName].currentSkillName === roundInfo[winnerDataName].ultimateName &&
                (isDuelInProgress || i < data.roundCount * framesPerRound)) {
                ctx.fillText(roundInfo[winnerDataName].currentSkillName, winnerHpBarXOffset, 235);
                ctx.strokeText(roundInfo[winnerDataName].currentSkillName, winnerHpBarXOffset, 235);
            }
            if (roundInfo[loserDataName].hasUltimate &&
                roundInfo[loserDataName].currentSkillName === roundInfo[loserDataName].ultimateName &&
                (isDuelInProgress || i < data.roundCount * framesPerRound)) {
                ctx.fillText(roundInfo[loserDataName].currentSkillName, loserHpBarXOffset, 235);
                ctx.strokeText(roundInfo[loserDataName].currentSkillName, loserHpBarXOffset, 235);
            }
            if (!isDuelInProgress && i > data.roundCount * framesPerRound) {
                ctx.font = '32px Righteous';
                ctx.fillStyle = 'green';
                ctx.strokeStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(`VENCEDOR!`, rightPokemon === data.winnerPokemon ? 365 : 105, 180);
                ctx.strokeText(`VENCEDOR!`, rightPokemon === data.winnerPokemon ? 365 : 105, 180);
            }
            encoder.addFrame(ctx);
            if (roundInfo.poke1Data.hp <= 0 || roundInfo.poke2Data.hp <= 0)
                isDuelInProgress = false;
        }
        // Finish encoding the GIF
        encoder.finish();
        resolve(filepath);
    }));
    (0, fileHelper_1.removeFileFromDisk)(filepath, 30000);
    return filepath;
});
exports.iGenWildPokemonBattle = iGenWildPokemonBattle;
//# sourceMappingURL=iGenWildPokemonBattle.js.map