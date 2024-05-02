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
exports.iGenDuelX6Rounds = void 0;
const canvas_1 = require("canvas");
const fs_1 = __importDefault(require("fs"));
const gifencoder_1 = __importDefault(require("gifencoder"));
const path_1 = __importDefault(require("path"));
const fileHelper_1 = require("../../helpers/fileHelper");
const loadOrSaveImageFromCache_1 = require("../../helpers/loadOrSaveImageFromCache");
const iGenDuelX6Rounds = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const filepath = yield new Promise(resolve => {
        function processCode() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
            return __awaiter(this, void 0, void 0, function* () {
                const { leftTeam, rightTeam } = data;
                // Define the dimensions of the canvas and the background
                const canvasWidth = 500;
                const canvasHeight = 500;
                const backgroundUrl = './src/assets/sprites/UI/hud/duel_bg/fighting.png';
                const hudUrl = './src/assets/sprites/UI/hud/duel_x2_round.png';
                // Create a canvas with the defined dimensions
                const canvas = (0, canvas_1.createCanvas)(canvasWidth, canvasHeight);
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = false;
                const filepath = path_1.default.join(__dirname, `/images/animation-${Math.random()}.gif`);
                // Create a new GIFEncoder instance
                const encoder = new gifencoder_1.default(500, 500);
                encoder.createReadStream().pipe(fs_1.default.createWriteStream(filepath));
                const rightTeamSprites = new Map([]);
                const leftTeamSprites = new Map([]);
                for (let i = 0; i < 6; i++) {
                    rightTeamSprites.set(rightTeam[i].id, yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(rightTeam[i].spriteUrl));
                    leftTeamSprites.set(leftTeam[i].id, yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(leftTeam[i].spriteUrl));
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
                // Load the background image
                const background = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(backgroundUrl);
                const hud = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(hudUrl);
                // Draw the still part of the animation:
                ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(hud, 0, 0, canvasWidth, canvasHeight);
                // Convert the canvas to a buffer
                const canvasBuffer = canvas.toBuffer('image/png'); // Specify the desired image format ('image/png' in this example)
                const duelStillImage = yield (0, loadOrSaveImageFromCache_1.loadOrSaveImageFromCache)(canvasBuffer);
                // Configure the GIFEncoder
                encoder.start();
                encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
                encoder.setDelay(400); // Delay between frames in milliseconds
                encoder.setQuality(60); // Image quality (lower is better)
                const framesPerRound = 2;
                let round = 1;
                let roundInfo = data.duelMap.get(round);
                for (let i = 0; i < data.roundCount * framesPerRound + 6; i++) {
                    if (i > round * framesPerRound && round < data.roundCount) {
                        round++;
                        roundInfo = data.duelMap.get(round);
                    }
                    if (!roundInfo)
                        roundInfo = data.duelMap.get(round - 1);
                    if (!roundInfo)
                        continue;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(duelStillImage, 0, 0, canvasWidth, canvasHeight);
                    console.log({
                        leftTeam: roundInfo.leftTeamData.map(p => {
                            return {
                                poke: p.name,
                                hp: p.hp,
                            };
                        }),
                        rightTeam: roundInfo.rightTeamData.map(p => {
                            return {
                                poke: p.name,
                                hp: p.hp,
                            };
                        }),
                    });
                    const rPoke1Sprite = rightTeamSprites.get((_a = roundInfo.rightTeamData[0]) === null || _a === void 0 ? void 0 : _a.id);
                    const rPoke2Sprite = rightTeamSprites.get((_b = roundInfo.rightTeamData[1]) === null || _b === void 0 ? void 0 : _b.id);
                    const lPoke1Sprite = leftTeamSprites.get((_c = roundInfo.leftTeamData[0]) === null || _c === void 0 ? void 0 : _c.id);
                    const lPoke2Sprite = leftTeamSprites.get((_d = roundInfo.leftTeamData[1]) === null || _d === void 0 ? void 0 : _d.id);
                    ctx.fillStyle = 'white';
                    if (rPoke1Sprite) {
                        ctx.drawImage(rPoke1Sprite, 240, 165, 250, 250);
                        ctx.font = '14px Righteous';
                        ctx.fillText(roundInfo.rightTeamData[0].name, 321, 93);
                        ctx.textAlign = 'start';
                        ctx.fillText(roundInfo.rightTeamData[0].level.toString(), 470, 93);
                        ctx.fillStyle = `rgb(160,40,40)`;
                        ctx.fillRect(365, 65, Math.max(0, (roundInfo.rightTeamData[0].hp / roundInfo.rightTeamData[0].maxHp) * 125), 7);
                        ctx.fillStyle = `rgb(50,121,211)`;
                        ctx.fillRect(365 - 55, 103, Math.max(0, (roundInfo.rightTeamData[0].mana / 100) * 175), 3);
                    }
                    if (rPoke2Sprite) {
                        ctx.drawImage(rPoke2Sprite, 315, 165, 250, 250);
                        ctx.font = '14px Righteous';
                        ctx.fillText(roundInfo.rightTeamData[1].name, 321, 150);
                        ctx.textAlign = 'start';
                        ctx.fillText(roundInfo.rightTeamData[1].level.toString(), 470, 150);
                        ctx.fillStyle = `rgb(160,40,40)`;
                        ctx.fillRect(365, 120, Math.max(0, (roundInfo.rightTeamData[1].hp / roundInfo.rightTeamData[1].maxHp) * 125), 7);
                        ctx.fillStyle = `rgb(50,121,211)`;
                        ctx.fillRect(365 - 55, 158, Math.max(0, (roundInfo.rightTeamData[1].mana / 100) * 175), 3);
                    }
                    if (lPoke1Sprite) {
                        ctx.translate(250, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(lPoke1Sprite, -50, 165, 250, 250);
                        ctx.translate(250, 0);
                        ctx.scale(-1, 1);
                        ctx.font = '14px Righteous';
                        ctx.fillText(roundInfo.leftTeamData[0].name, 45, 93);
                        ctx.textAlign = 'start';
                        ctx.fillText(roundInfo.leftTeamData[0].level.toString(), 200, 93);
                        ctx.fillStyle = `rgb(160,40,40)`;
                        ctx.fillRect(55, 65, Math.max(0, (roundInfo.leftTeamData[0].hp / roundInfo.leftTeamData[0].maxHp) * 125), 7);
                        ctx.fillStyle = `rgb(50,121,211)`;
                        ctx.fillRect(55 - 55, 103, Math.max(0, (roundInfo.leftTeamData[0].mana / 103) * 175), 3);
                    }
                    if (lPoke2Sprite) {
                        ctx.translate(250, 0);
                        ctx.scale(-1, 1);
                        ctx.drawImage(lPoke2Sprite, 25, 165, 250, 250);
                        ctx.translate(250, 0);
                        ctx.scale(-1, 1);
                        ctx.font = '14px Righteous';
                        ctx.fillText(roundInfo.leftTeamData[1].name, 45, 150);
                        ctx.textAlign = 'start';
                        ctx.fillText(roundInfo.leftTeamData[1].level.toString(), 200, 150);
                        ctx.fillStyle = `rgb(160,40,40)`;
                        ctx.fillRect(55, 120, Math.max(0, (roundInfo.leftTeamData[1].hp / roundInfo.leftTeamData[1].maxHp) * 125), 7);
                        ctx.fillStyle = `rgb(50,121,211)`;
                        ctx.fillRect(55 - 55, 158, Math.max(0, (roundInfo.leftTeamData[1].mana / 100) * 175), 3);
                    }
                    // write skills
                    ctx.font = '18px Righteous';
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'start';
                    if (i % 6 !== 0) {
                        ctx.fillText((_f = (_e = roundInfo.leftTeamData[0]) === null || _e === void 0 ? void 0 : _e.currentSkillName) !== null && _f !== void 0 ? _f : '', 15, 411);
                        ctx.fillText((_h = (_g = roundInfo.leftTeamData[1]) === null || _g === void 0 ? void 0 : _g.currentSkillName) !== null && _h !== void 0 ? _h : '', 15, 477);
                        ctx.fillText((_k = (_j = roundInfo.rightTeamData[0]) === null || _j === void 0 ? void 0 : _j.currentSkillName) !== null && _k !== void 0 ? _k : '', 315, 411);
                        ctx.fillText((_m = (_l = roundInfo.rightTeamData[1]) === null || _l === void 0 ? void 0 : _l.currentSkillName) !== null && _m !== void 0 ? _m : '', 315, 477);
                    }
                    // draw skill types
                    const leftFlag0 = skillFlagImagesMap.get((_p = (_o = roundInfo.leftTeamData[0]) === null || _o === void 0 ? void 0 : _o.currentSkillType) !== null && _p !== void 0 ? _p : '');
                    if (leftFlag0)
                        ctx.drawImage(leftFlag0, 131, 393, 75, 25);
                    const leftFlag1 = skillFlagImagesMap.get((_r = (_q = roundInfo.leftTeamData[1]) === null || _q === void 0 ? void 0 : _q.currentSkillType) !== null && _r !== void 0 ? _r : '');
                    if (leftFlag1)
                        ctx.drawImage(leftFlag1, 131, 451, 75, 25);
                    const rightFlag0 = skillFlagImagesMap.get((_t = (_s = roundInfo.rightTeamData[0]) === null || _s === void 0 ? void 0 : _s.currentSkillType) !== null && _t !== void 0 ? _t : '');
                    if (rightFlag0)
                        ctx.drawImage(rightFlag0, 421, 393, 75, 25);
                    const rightFlag1 = skillFlagImagesMap.get((_v = (_u = roundInfo.rightTeamData[1]) === null || _u === void 0 ? void 0 : _u.currentSkillType) !== null && _v !== void 0 ? _v : '');
                    if (rightFlag1)
                        ctx.drawImage(rightFlag1, 421, 451, 75, 25);
                    ctx.font = '32px Righteous';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Round ${round}`, 250, 31);
                    // write crits
                    ctx.font = '32px Righteous';
                    ctx.fillStyle = 'yellow';
                    ctx.strokeStyle = 'black';
                    ctx.textAlign = 'start';
                    if (((_w = roundInfo.rightTeamData[0]) === null || _w === void 0 ? void 0 : _w.crit) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`CRITICAL!`, 365, 180);
                        ctx.strokeText(`CRITICAL!`, 365, 180);
                    }
                    if (((_x = roundInfo.leftTeamData[0]) === null || _x === void 0 ? void 0 : _x.crit) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`CRITICAL!`, 55, 180);
                        ctx.strokeText(`CRITICAL!`, 55, 180);
                    }
                    if (((_y = roundInfo.rightTeamData[1]) === null || _y === void 0 ? void 0 : _y.crit) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`CRITICAL!`, 365, 195);
                        ctx.strokeText(`CRITICAL!`, 365, 195);
                    }
                    if (((_z = roundInfo.leftTeamData[1]) === null || _z === void 0 ? void 0 : _z.crit) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`CRITICAL!`, 55, 195);
                        ctx.strokeText(`CRITICAL!`, 55, 195);
                    }
                    ctx.fillStyle = 'blue';
                    if (((_0 = roundInfo.rightTeamData[0]) === null || _0 === void 0 ? void 0 : _0.block) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`BLOCK!`, 365, 215);
                        ctx.strokeText(`BLOCK!`, 365, 215);
                    }
                    if (((_1 = roundInfo.leftTeamData[0]) === null || _1 === void 0 ? void 0 : _1.block) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`BLOCK!`, 55, 215);
                        ctx.strokeText(`BLOCK!`, 55, 215);
                    }
                    if (((_2 = roundInfo.rightTeamData[1]) === null || _2 === void 0 ? void 0 : _2.block) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`BLOCK!`, 365, 231);
                        ctx.strokeText(`BLOCK!`, 365, 231);
                    }
                    if (((_3 = roundInfo.leftTeamData[1]) === null || _3 === void 0 ? void 0 : _3.block) && i < data.roundCount * framesPerRound) {
                        ctx.fillText(`BLOCK!`, 55, 231);
                        ctx.strokeText(`BLOCK!`, 55, 231);
                    }
                    if (i > data.roundCount * framesPerRound) {
                        ctx.font = '32px Righteous';
                        ctx.fillStyle = 'green';
                        ctx.strokeStyle = 'black';
                        ctx.textAlign = 'center';
                        ctx.fillText(`VENCEDOR!`, data.winnerSide === 'right' ? 365 : 105, 180);
                        ctx.strokeText(`VENCEDOR!`, data.winnerSide === 'right' ? 365 : 105, 180);
                    }
                    encoder.addFrame(ctx);
                }
                // Finish encoding the GIF
                encoder.finish();
                return filepath;
            });
        }
        const filepath = processCode();
        resolve(filepath);
    });
    (0, fileHelper_1.removeFileFromDisk)(filepath, 60000);
    Promise.all(filepath);
    return filepath;
});
exports.iGenDuelX6Rounds = iGenDuelX6Rounds;
//# sourceMappingURL=iGenDuelX6Rounds.js.map