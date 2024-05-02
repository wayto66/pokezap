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
exports.iGenDuel3X1Rounds = void 0;
const fs_1 = __importDefault(require("fs"));
const gifencoder_1 = __importDefault(require("gifencoder"));
const path_1 = __importDefault(require("path"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const canvasHelper_1 = require("../../../server/helpers/canvasHelper");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenDuel3X1Rounds = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = yield new Promise(resolve => {
        function processCode() {
            var _a, _b, _c, _d, _e, _f;
            return __awaiter(this, void 0, void 0, function* () {
                const boss = data.rightTeam[0];
                const allyTeam = data.leftTeam;
                const { backgroundTypeName } = data || [boss.type1, boss.type2 || boss.type1][Math.floor(Math.random() * 2)];
                const hudUrl = './src/assets/sprites/UI/hud/duel_3x1_round.png';
                const backgroundUrl = `./src/assets/sprites/UI/hud/duel_bg/${backgroundTypeName}.png`;
                // Create a canvas with the defined dimensions
                const canvas = yield (0, canvasHelper_1.createCanvas2d)(1, false);
                const filepath = path_1.default.join(__dirname, `/images/animation-${Math.random()}.gif`);
                // Create a new GIFEncoder instance
                const encoder = new gifencoder_1.default(500, 500);
                encoder.createReadStream().pipe(fs_1.default.createWriteStream(filepath));
                // load poke1 sprite
                const allyPokeSprite0 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(allyTeam[0].spriteUrl);
                // load poke2 sprite
                const allyPokeSprite1 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(allyTeam[1].spriteUrl);
                // load poke3 sprite
                const allyPokeSprite2 = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(allyTeam[2].spriteUrl);
                // load boss sprite
                const bossSprite = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(boss.spriteUrl);
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
                // Load the background image
                const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
                const hud = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(hudUrl);
                const leftPokeCanvas = yield (0, canvasHelper_1.createCanvas2d)(1, false, 250);
                // Draw the still part of the animation:
                const drawStillPart = (roundInfo) => {
                    leftPokeCanvas.clearArea();
                    canvas.draw({
                        height: 500,
                        width: 500,
                        positionX: 0,
                        positionY: 0,
                        image: background,
                    });
                    canvas.draw({
                        height: 500,
                        width: 500,
                        positionX: 0,
                        positionY: 0,
                        image: hud,
                    });
                    if (roundInfo.leftTeamData[2].hp > 0)
                        leftPokeCanvas.draw({
                            height: 251,
                            width: 251,
                            positionX: -51,
                            positionY: 95,
                            image: allyPokeSprite2,
                        });
                    if (roundInfo.leftTeamData[0].hp > 0)
                        leftPokeCanvas.draw({
                            height: 251,
                            width: 251,
                            positionX: 65,
                            positionY: 150,
                            image: allyPokeSprite0,
                        });
                    if (roundInfo.leftTeamData[1].hp > 0)
                        leftPokeCanvas.draw({
                            height: 251,
                            width: 251,
                            positionX: -50,
                            positionY: 160,
                            image: allyPokeSprite1,
                        });
                    canvas.draw({
                        height: 500,
                        width: 250,
                        positionX: 0,
                        positionY: 0,
                        image: leftPokeCanvas.canvas,
                    });
                    if (roundInfo.rightTeamData[0].hp > 0)
                        canvas.draw({
                            height: 251,
                            width: 251,
                            positionX: 240,
                            positionY: 145,
                            image: bossSprite,
                        });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 65,
                        positionY: 35,
                        textAlign: 'start',
                        text: allyTeam[0].name,
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 200,
                        positionY: 35,
                        textAlign: 'start',
                        text: allyTeam[0].level.toString(),
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 65,
                        positionY: 85,
                        textAlign: 'start',
                        text: allyTeam[1].name,
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 200,
                        positionY: 85,
                        textAlign: 'start',
                        text: allyTeam[1].level.toString(),
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 65,
                        positionY: 135,
                        textAlign: 'start',
                        text: allyTeam[2].name,
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 200,
                        positionY: 135,
                        textAlign: 'start',
                        text: allyTeam[2].level.toString(),
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 325,
                        positionY: 135,
                        textAlign: 'start',
                        text: boss.name,
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '14px Righteous',
                        positionX: 486,
                        positionY: 135,
                        textAlign: 'end',
                        text: boss.level.toString(),
                    });
                };
                // Configure the GIFEncoder
                encoder.start();
                encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
                encoder.setDelay(200); // Delay between frames in milliseconds
                encoder.setQuality(60); // Image quality (lower is better)
                const framesPerRound = 2;
                let round = 1;
                let roundInfo = data.duelMap.get(round);
                if (!roundInfo)
                    roundInfo = data.duelMap.get(round - 1);
                if (!roundInfo)
                    throw new AppErrors_1.UnexpectedError('no round info in igenduel3x1');
                leftPokeCanvas.invertHorizontally();
                for (let i = 0; i < data.roundCount * framesPerRound + 12; i++) {
                    if (i > round * framesPerRound && round < data.roundCount) {
                        round++;
                        roundInfo = data.duelMap.get(round);
                    }
                    if (!roundInfo)
                        roundInfo = data.duelMap.get(round - 1);
                    if (!roundInfo)
                        continue;
                    canvas.clearArea();
                    drawStillPart(roundInfo);
                    canvas.fillRect({
                        fillStyle: `rgb(160,40,40)`,
                        x: 55,
                        y: 7,
                        w: Math.max(0, (roundInfo.leftTeamData[0].hp / roundInfo.leftTeamData[0].maxHp) * 125),
                        h: 7,
                    });
                    canvas.fillRect({
                        fillStyle: `rgb(160,40,40)`,
                        x: 55,
                        y: 62,
                        w: Math.max(0, (roundInfo.leftTeamData[1].hp / roundInfo.leftTeamData[1].maxHp) * 125),
                        h: 7,
                    });
                    canvas.fillRect({
                        fillStyle: `rgb(160,40,40)`,
                        x: 55,
                        y: 107,
                        w: Math.max(0, (roundInfo.leftTeamData[2].hp / roundInfo.leftTeamData[2].maxHp) * 125),
                        h: 7,
                    });
                    canvas.fillRect({
                        fillStyle: `rgb(160,40,40)`,
                        x: 380,
                        y: 108,
                        w: Math.max(0, (roundInfo.rightTeamData[0].hp / roundInfo.rightTeamData[0].maxHp) * 125),
                        h: 7,
                    });
                    // draw mana
                    canvas.fillRect({
                        fillStyle: `rgb(50,121,211)`,
                        x: 5,
                        y: 50,
                        w: Math.max(0, (roundInfo.leftTeamData[0].mana / 100) * 175),
                        h: 3,
                    });
                    canvas.fillRect({
                        fillStyle: `rgb(50,121,211)`,
                        x: 5,
                        y: 100,
                        w: Math.max(0, (roundInfo.leftTeamData[1].mana / 100) * 175),
                        h: 3,
                    });
                    canvas.fillRect({
                        fillStyle: `rgb(50,121,211)`,
                        x: 5,
                        y: 145,
                        w: Math.max(0, (roundInfo.leftTeamData[2].mana / 100) * 175),
                        h: 3,
                    });
                    canvas.fillRect({
                        fillStyle: `rgb(50,121,211)`,
                        x: 315,
                        y: 145,
                        w: Math.max(0, (roundInfo.rightTeamData[0].mana / 100) * 175),
                        h: 3,
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '15px Righteous',
                        textAlign: 'start',
                        positionX: 15,
                        positionY: 375,
                        text: (_a = roundInfo.leftTeamData[0].currentSkillName) !== null && _a !== void 0 ? _a : '',
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '15px Righteous',
                        textAlign: 'start',
                        positionX: 15,
                        positionY: 425,
                        text: (_b = roundInfo.leftTeamData[1].currentSkillName) !== null && _b !== void 0 ? _b : '',
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '15px Righteous',
                        textAlign: 'start',
                        positionX: 15,
                        positionY: 475,
                        text: (_c = roundInfo.leftTeamData[2].currentSkillName) !== null && _c !== void 0 ? _c : '',
                    });
                    canvas.write({
                        fillStyle: 'white',
                        font: '15px Righteous',
                        textAlign: 'start',
                        positionX: 315,
                        positionY: 425,
                        text: (_d = roundInfo.rightTeamData[0].currentSkillName) !== null && _d !== void 0 ? _d : '',
                    });
                    // draw skill types
                    if (i % 6 !== 0) {
                        const bossSkillFlag = skillFlagImagesMap.get((_e = roundInfo.rightTeamData[0].currentSkillType) !== null && _e !== void 0 ? _e : '');
                        if (bossSkillFlag)
                            canvas.draw({
                                positionX: 421,
                                positionY: 405,
                                height: 25,
                                width: 72,
                                image: bossSkillFlag,
                            });
                        for (let i = 0; i < roundInfo.leftTeamData.length; i++) {
                            const skillFlag = skillFlagImagesMap.get((_f = roundInfo.leftTeamData[i].currentSkillType) !== null && _f !== void 0 ? _f : '');
                            if (skillFlag) {
                                canvas.draw({
                                    positionX: 131,
                                    positionY: 362 + i * 50,
                                    height: 25,
                                    width: 72,
                                    image: skillFlag,
                                });
                            }
                        }
                    }
                    canvas.write({
                        positionX: 345,
                        positionY: 51,
                        textAlign: 'center',
                        font: '32px Righteous',
                        text: `Round ${round}`,
                        fillStyle: 'white',
                    });
                    /// write crits
                    if (roundInfo.leftTeamData.map(ally => ally.crit).some(crit => crit === true) &&
                        i < data.roundCount * framesPerRound) {
                        canvas.write({
                            positionX: 55,
                            positionY: 180,
                            textAlign: 'center',
                            font: '25px Righteous',
                            text: `CRITICAL!`,
                            fillStyle: 'yellow',
                            strokeStyle: 'black',
                            strokeText: true,
                        });
                    }
                    if (roundInfo.rightTeamData[0].crit && i < data.roundCount * framesPerRound) {
                        canvas.write({
                            positionX: 365,
                            positionY: 180,
                            textAlign: 'center',
                            font: '25px Righteous',
                            text: `CRITICAL!`,
                            fillStyle: 'yellow',
                            strokeStyle: 'black',
                            strokeText: true,
                        });
                    }
                    /// write blocks
                    if (roundInfo.leftTeamData.map(ally => ally.block).some(block => block === true) &&
                        i < data.roundCount * framesPerRound) {
                        canvas.write({
                            positionX: 55,
                            positionY: 215,
                            textAlign: 'center',
                            font: '25px Righteous',
                            text: `BLOCK!`,
                            fillStyle: 'blue',
                            strokeStyle: 'black',
                            strokeText: true,
                        });
                    }
                    if (roundInfo.rightTeamData[0].block && i < data.roundCount * framesPerRound) {
                        canvas.write({
                            positionX: 365,
                            positionY: 215,
                            textAlign: 'center',
                            font: '25px Righteous',
                            text: `BLOCK!`,
                            fillStyle: 'blue',
                            strokeStyle: 'black',
                            strokeText: true,
                        });
                    }
                    if (i > data.roundCount * framesPerRound) {
                        canvas.write({
                            positionX: data.winnerSide === 'right' ? 365 : 105,
                            positionY: 180,
                            textAlign: 'center',
                            font: '32px Righteous',
                            text: `VENCEDOR!`,
                            fillStyle: 'green',
                            strokeStyle: 'black',
                            strokeText: true,
                        });
                    }
                    canvas.addFrameToEncoder(encoder);
                }
                // Finish encoding the GIF
                encoder.finish();
                return filepath;
            });
        }
        resolve(processCode());
    });
    (0, fileHelper_1.removeFileFromDisk)(filepath, 60000);
    Promise.all(filepath);
    return filepath;
});
exports.iGenDuel3X1Rounds = iGenDuel3X1Rounds;
//# sourceMappingURL=iGenDuel3X1Rounds.js.map