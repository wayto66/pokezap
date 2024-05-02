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
exports.iGenDuelRound = void 0;
const path_1 = __importDefault(require("path"));
const talentIdMap_1 = require("../../../server/constants/talentIdMap");
const canvasHelper_1 = require("../../../server/helpers/canvasHelper");
const encoderHelper_1 = require("../../../server/helpers/encoderHelper");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenDuelRound = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const rightPokemon = data.rightTeam[0];
    const leftPokemon = data.leftTeam[0];
    const { duelMap } = data;
    const canvas2d = yield (0, canvasHelper_1.createCanvas2d)(1);
    const filepath = path_1.default.join(__dirname, `/images/animation-${Math.random()}.gif`);
    const encoder = (0, encoderHelper_1.initEncoder)(filepath);
    const pokemonRightSideTalents = getTalents(rightPokemon);
    const pokemonleftSideTalents = getTalents(leftPokemon);
    const framesPerRound = 4;
    let round = data.staticImage ? data.roundCount : 1;
    let roundInfo = duelMap.get(round);
    const rightHpBarXOffset = 365;
    const leftHpBarXOffset = 55;
    const bg1 = `./src/assets/sprites/UI/hud/duel_bg/${rightPokemon.type1}.png`;
    const bg2 = `./src/assets/sprites/UI/hud/duel_bg/${rightPokemon.type2 || rightPokemon.type1}.png`;
    const bgs = [bg1, bg2];
    const backgroundUrl = bgs[Math.floor(Math.random() * bgs.length)];
    const backgroundImage = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
    const hudImage = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/hud/duel_x1_round.png');
    const rightPokemonImage = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(rightPokemon.spriteUrl);
    const leftPokemonImage = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(leftPokemon.spriteUrl);
    const talentImageMap = new Map([]);
    for (const talent of [pokemonRightSideTalents, pokemonleftSideTalents].flat()) {
        if (!talent)
            continue;
        talentImageMap.set(talent, yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(`./src/assets/sprites/UI/types/circle/${talent}.png`));
    }
    const skillFlagImagesMap = new Map([]);
    for (const poke of [data.leftTeam, data.rightTeam].flat()) {
        if (!poke.skillMap)
            continue;
        const skillMap = [
            ...poke.skillMap.supportSkills,
            ...poke.skillMap.tankerSkills,
            ...Array.from(poke.skillMap.damageSkills.keys()),
        ];
        console.log(skillMap.map(s => s.name));
        for (const skill of skillMap) {
            if (!skillFlagImagesMap.get(skill.typeName)) {
                skillFlagImagesMap.set(skill.typeName, yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)('./src/assets/sprites/UI/types/' + skill.typeName + '.png'));
            }
        }
    }
    const leftPokeCanvas = yield (0, canvasHelper_1.createCanvas2d)(1, false, 250);
    (0, canvasHelper_1.drawBackground)(canvas2d, backgroundImage);
    (0, canvasHelper_1.drawBackground)(canvas2d, hudImage);
    (0, canvasHelper_1.drawTalents)(canvas2d, talentImageMap, pokemonRightSideTalents, 305);
    (0, canvasHelper_1.drawTalents)(canvas2d, talentImageMap, pokemonleftSideTalents, 5);
    drawPokemons(canvas2d, rightPokemonImage, 285, 165, rightPokemon.isGiant);
    leftPokeCanvas.invertHorizontally();
    leftPokeCanvas.draw({
        height: 250 * (leftPokemon.isGiant ? 1.25 : 1),
        width: 250 * (leftPokemon.isGiant ? 1.25 : 1),
        positionX: 0,
        positionY: 165,
        image: leftPokemonImage,
    });
    canvas2d.draw({
        height: 500,
        width: 250,
        positionX: 0,
        positionY: 0,
        image: leftPokeCanvas.canvas,
    });
    const buffer = canvas2d.toBuffer();
    const stillBackground = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(buffer);
    const totalBattleFrames = data.staticImage ? 1 : data.roundCount * framesPerRound + 40;
    // Gravar o tempo de início
    const start = performance.now();
    for (let i = 0; i < totalBattleFrames; i++) {
        if (i > round * framesPerRound && i < totalBattleFrames) {
            round++;
            roundInfo = duelMap.get(round);
            if (!roundInfo)
                roundInfo = duelMap.get(round - 1);
        }
        if (!roundInfo)
            continue;
        canvas2d.clearArea();
        canvas2d.draw({
            height: 500,
            width: 500,
            image: stillBackground,
            positionX: 0,
            positionY: 0,
        });
        drawHpBars(canvas2d, rightHpBarXOffset, roundInfo.rightTeamData[0].hp, roundInfo.rightTeamData[0].maxHp);
        drawHpBars(canvas2d, leftHpBarXOffset, roundInfo.leftTeamData[0].hp, roundInfo.leftTeamData[0].maxHp);
        drawManaBars(canvas2d, leftHpBarXOffset, roundInfo.leftTeamData[0].mana);
        drawManaBars(canvas2d, rightHpBarXOffset, roundInfo.rightTeamData[0].mana);
        (0, canvasHelper_1.writeSkills)({
            canvas2d,
            value: (_a = roundInfo.leftTeamData[0].currentSkillName) !== null && _a !== void 0 ? _a : '',
            positionX: 15,
            positionY: 480,
        });
        (0, canvasHelper_1.writeSkills)({
            canvas2d,
            value: (_b = roundInfo.rightTeamData[0].currentSkillName) !== null && _b !== void 0 ? _b : '',
            positionX: 305,
            positionY: 480,
        });
        // draw skill types
        if (i % 6 !== 0 || data.staticImage) {
            const leftFlag0 = skillFlagImagesMap.get((_c = roundInfo.leftTeamData[0].currentSkillType) !== null && _c !== void 0 ? _c : '');
            if (leftFlag0)
                canvas2d.draw({ image: leftFlag0, positionX: 131, positionY: 465, width: 75, height: 25 });
            const rightFlag0 = skillFlagImagesMap.get((_d = roundInfo.rightTeamData[0].currentSkillType) !== null && _d !== void 0 ? _d : '');
            if (rightFlag0)
                canvas2d.draw({ image: rightFlag0, positionX: 421, positionY: 465, width: 75, height: 25 });
        }
        drawTexts(canvas2d, rightPokemon, leftPokemon, round);
        if (roundInfo.rightTeamData[0].crit && i < totalBattleFrames) {
            drawCriticalText(canvas2d, rightHpBarXOffset);
        }
        if (roundInfo.leftTeamData[0].crit && i < totalBattleFrames) {
            drawCriticalText(canvas2d, leftHpBarXOffset);
        }
        if (roundInfo.rightTeamData[0].block && i < totalBattleFrames) {
            drawBlockText(canvas2d, rightHpBarXOffset);
        }
        if (roundInfo.leftTeamData[0].block && i < totalBattleFrames) {
            drawBlockText(canvas2d, leftHpBarXOffset);
        }
        if (i > data.roundCount * framesPerRound || data.staticImage) {
            if (data.winnerSide === 'right')
                drawWinnerText(canvas2d, 365);
            if (data.winnerSide === 'left')
                drawWinnerText(canvas2d, 105);
        }
        if (data.staticImage) {
            const filepath = yield (0, fileHelper_1.saveFileOnDisk)(canvas2d); // Salvamento do canvas como um arquivo no disco
            (0, fileHelper_1.removeFileFromDisk)(filepath); // Remoção do arquivo do disco
            return filepath; // Retorno do caminho do arquivo
        }
        canvas2d.addFrameToEncoder(encoder);
    }
    // Gravar o tempo de término
    const end = performance.now();
    // Calcular a diferença entre o tempo de término e o tempo de início
    const executionTime = end - start;
    console.log(`Tempo de execução: ${executionTime} ms`);
    encoder.finish();
    (0, fileHelper_1.removeFileFromDisk)(filepath);
    return filepath;
});
exports.iGenDuelRound = iGenDuelRound;
const drawHpBars = (canvas2d, xOffset, hp, maxHp) => {
    canvas2d.drawBar({
        type: 'hp',
        xOffset: xOffset,
        value: hp / maxHp,
    });
};
const drawManaBars = (canvas2d, xOffset, mana) => {
    canvas2d.drawBar({ type: 'mana', xOffset, value: mana / 100 });
};
const drawPokemons = (canvas2d, image, positionX, positionY, isGiant) => {
    canvas2d.draw({
        image,
        positionX,
        positionY,
        width: 250 * (isGiant ? 1.25 : 1),
        height: 250 * (isGiant ? 1.25 : 1),
    });
};
const drawTexts = (canvas2d, rightPokemon, leftPokemon, round) => {
    canvas2d.write({
        font: '14px Righteous',
        fillStyle: 'white',
        text: rightPokemon.name,
        textAlign: 'start',
        positionX: 350,
        positionY: 135,
    });
    canvas2d.write({
        font: '14px Righteous',
        fillStyle: 'white',
        text: leftPokemon.name,
        textAlign: 'start',
        positionX: 65,
        positionY: 135,
    });
    canvas2d.write({
        font: '14px Righteous',
        fillStyle: 'white',
        text: rightPokemon.level.toString(),
        textAlign: 'start',
        positionX: 470,
        positionY: 135,
    });
    canvas2d.write({
        font: '14px Righteous',
        fillStyle: 'white',
        text: leftPokemon.level.toString(),
        textAlign: 'start',
        positionX: 200,
        positionY: 135,
    });
    canvas2d.write({
        font: '32px Righteous',
        fillStyle: 'white',
        text: `Round ${round}`,
        textAlign: 'center',
        positionX: 250,
        positionY: 52,
    });
};
const drawCriticalText = (canvas2d, xOffset) => {
    canvas2d.write({
        font: '32px Righteous',
        fillStyle: 'yellow',
        strokeStyle: 'black',
        text: `CRITICAL!`,
        textAlign: 'start',
        positionX: xOffset,
        positionY: 180,
        strokeText: true,
    });
};
const drawBlockText = (canvas2d, xOffset) => {
    canvas2d.write({
        font: '32px Righteous',
        fillStyle: 'blue',
        strokeStyle: 'black',
        text: `BLOCK!`,
        textAlign: 'start',
        positionX: xOffset,
        positionY: 215,
        strokeText: true,
    });
};
const drawWinnerText = (canvas2d, xOffset) => {
    canvas2d.write({
        font: '32px Righteous',
        fillStyle: 'green',
        strokeStyle: 'black',
        text: 'VENCEDOR!',
        textAlign: 'center',
        positionX: xOffset,
        positionY: 180,
        strokeText: true,
    });
};
const getTalents = (playerData) => {
    const talents = [];
    for (let i = 1; i <= 9; i++) {
        const talent = talentIdMap_1.talentIdMap.get(playerData[`talentId${i}`]);
        talents.push(talent);
    }
    return talents;
};
//# sourceMappingURL=iGenDuelRound.js.map