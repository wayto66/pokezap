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
Object.defineProperty(exports, "__esModule", { value: true });
exports.iGenRocketInvasionX2 = void 0;
const canvas_1 = require("canvas");
const talentIdMap_1 = require("../../constants/talentIdMap");
const canvasHelper_1 = require("../../helpers/canvasHelper");
const fileHelper_1 = require("../../helpers/fileHelper");
const iGenRocketInvasionX2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { pokemon1, pokemon2, invasionSession } = data;
    const canvas2d = yield (0, canvasHelper_1.createCanvas2d)(1);
    const backgroundImage = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/hud/rocket_invasion_x2.png');
    (0, canvasHelper_1.drawBackground)(canvas2d, backgroundImage);
    const rocketAvatarSpriteUrl = './src/assets/sprites/rocket avatars/' + Math.ceil(Math.random() * 3) + '.png';
    yield canvas2d.draw({
        height: 300,
        width: 300,
        positionX: 100,
        positionY: 100,
        image: yield (0, canvas_1.loadImage)(rocketAvatarSpriteUrl),
    });
    yield canvas2d.draw({
        height: 150,
        width: 150,
        positionY: 75,
        positionX: 50,
        image: yield (0, canvas_1.loadImage)(pokemon1.spriteUrl),
    });
    yield canvas2d.draw({
        height: 150,
        width: 150,
        positionY: 290,
        positionX: 50,
        image: yield (0, canvas_1.loadImage)(pokemon2.spriteUrl),
    });
    canvas2d.write({
        fillStyle: 'white',
        font: '16px Pokemon',
        positionX: 5,
        positionY: 315,
        textAlign: 'start',
        text: 'lvl: ' + pokemon1.level,
    });
    canvas2d.write({
        fillStyle: 'white',
        font: '16px Pokemon',
        positionX: 495,
        positionY: 315,
        textAlign: 'end',
        text: 'lvl: ' + pokemon2.level,
    });
    canvas2d.write({
        fillStyle: 'white',
        font: '32px Pokemon',
        positionX: 250,
        positionY: 10,
        textAlign: 'center',
        text: invasionSession.name,
    });
    const talentsPokemon1 = getTalents(pokemon1);
    const talentsPokemon2 = getTalents(pokemon2);
    const NUM_TALENTS = 9;
    const TALENT_SIZE = 18;
    const TALENT_OFFSET_X = 20;
    const y = 470;
    for (let i = 0; i < NUM_TALENTS; i++) {
        const talentPokemon1 = talentsPokemon1[i];
        const talentPokemon2 = talentsPokemon2[i];
        if (!talentPokemon1 || !talentPokemon2) {
            throw new Error(`Invalid talents: ${i}`);
        }
        const xPlayer1 = 5 + i * TALENT_OFFSET_X;
        canvas2d.draw({
            image: yield (0, canvasHelper_1.getTalent)(talentPokemon1),
            positionX: xPlayer1,
            positionY: y,
            width: TALENT_SIZE,
            height: TALENT_SIZE,
        });
        const xPlayer2 = 325 + i * TALENT_OFFSET_X;
        canvas2d.draw({
            image: yield (0, canvasHelper_1.getTalent)(talentPokemon2),
            positionX: xPlayer2,
            positionY: y,
            width: TALENT_SIZE,
            height: TALENT_SIZE,
        });
    }
    const filepath = yield (0, fileHelper_1.saveFileOnDisk)(canvas2d);
    (0, fileHelper_1.removeFileFromDisk)(filepath);
    return filepath;
});
exports.iGenRocketInvasionX2 = iGenRocketInvasionX2;
const getTalents = (pokemon) => {
    const talents = [];
    for (let i = 1; i <= 9; i++) {
        const talent = talentIdMap_1.talentIdMap.get(pokemon[`talentId${i}`]);
        talents.push(talent);
    }
    return talents;
};
//# sourceMappingURL=iGenRocketInvasionX2.js.map