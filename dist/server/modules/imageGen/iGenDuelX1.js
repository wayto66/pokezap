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
exports.iGenDuelX1 = void 0;
const canvas_1 = require("canvas");
const talentIdMap_1 = require("../../../server/constants/talentIdMap");
const canvasHelper_1 = require("../../../server/helpers/canvasHelper");
const fileHelper_1 = require("../../../server/helpers/fileHelper");
const iGenDuelX1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { spriteUrl: spriteUrl1, name: name1, elo: elo1 } = data.player1;
    const { spriteUrl: spriteUrl2, name: name2, elo: elo2 } = data.player2;
    const canvas2d = yield (0, canvasHelper_1.createCanvas2d)(1);
    const backgroundImage = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/hud/duel_x1.png');
    (0, canvasHelper_1.drawBackground)(canvas2d, backgroundImage);
    yield (0, canvasHelper_1.drawAvatarPlayer)({
        canvas2d,
        avatarPositionX: 0,
        avatarPositionY: 90,
        spriteUrl: spriteUrl1,
        name: name1,
        elo: elo1,
        namePositionX: 5,
        namePositionY: 55,
        eloPositionX: 51,
        eloPositionY: 75,
        textAlign: 'start',
    });
    yield (0, canvasHelper_1.drawAvatarPlayer)({
        canvas2d,
        avatarPositionX: 300,
        avatarPositionY: 90,
        spriteUrl: spriteUrl2,
        name: name2,
        namePositionX: 495,
        namePositionY: 55,
        elo: elo2,
        eloPositionX: 450,
        eloPositionY: 75,
        textAlign: 'end',
    });
    yield (0, canvasHelper_1.drawPokemon)({
        canvas2d,
        positionX: 0,
        positionY: 275,
        imageUrl: data.player1.teamPoke1.spriteUrl,
        id: data.player1.teamPoke1.id,
        idPositionX: 5,
        idPositionY: 340,
        textAlign: 'start',
        isGiant: data.player1.teamPoke1.isGiant,
    });
    yield (0, canvasHelper_1.drawPokemon)({
        canvas2d,
        positionX: 300,
        positionY: 275,
        imageUrl: data.player2.teamPoke1.spriteUrl,
        id: data.player2.teamPoke1.id,
        idPositionX: 495,
        idPositionY: 340,
        textAlign: 'end',
        isGiant: data.player2.teamPoke1.isGiant,
    });
    const talentsPokemonPlayer1 = getTalents(data.player1);
    const talentsPokemonPlayer2 = getTalents(data.player2);
    const NUM_TALENTS = 9;
    const TALENT_SIZE = 18;
    const TALENT_OFFSET_X = 20;
    const y = 470;
    for (let i = 0; i < NUM_TALENTS; i++) {
        const talentPokemonPlayer1 = talentsPokemonPlayer1[i];
        const talentPokemonPlayer2 = talentsPokemonPlayer2[i];
        if (!talentPokemonPlayer1 || !talentPokemonPlayer2) {
            throw new Error(`Invalid talents: ${i}`);
        }
        const xPlayer1 = 5 + i * TALENT_OFFSET_X;
        canvas2d.draw({
            image: yield (0, canvasHelper_1.getTalent)(talentPokemonPlayer1),
            positionX: xPlayer1,
            positionY: y,
            width: TALENT_SIZE,
            height: TALENT_SIZE,
        });
        const xPlayer2 = 320 + i * TALENT_OFFSET_X;
        canvas2d.draw({
            image: yield (0, canvasHelper_1.getTalent)(talentPokemonPlayer2),
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
exports.iGenDuelX1 = iGenDuelX1;
const getTalents = (playerData) => {
    const talents = [];
    for (let i = 1; i <= 9; i++) {
        const talent = talentIdMap_1.talentIdMap.get(playerData.teamPoke1[`talentId${i}`]);
        talents.push(talent);
    }
    return talents;
};
//# sourceMappingURL=iGenDuelX1.js.map