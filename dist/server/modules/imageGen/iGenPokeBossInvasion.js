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
exports.iGenPokeBossInvasion = void 0;
const canvas_1 = require("canvas");
const talentIdMap_1 = require("../../constants/talentIdMap");
const canvasHelper_1 = require("../../helpers/canvasHelper");
const fileHelper_1 = require("../../helpers/fileHelper");
const iGenPokeBossInvasion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { pokeBoss, invasionSession } = data;
    const canvas2d = yield (0, canvasHelper_1.createCanvas2d)(1);
    const backgroundImage = yield (0, canvas_1.loadImage)('./src/assets/sprites/UI/hud/poke_boss_invasion.png');
    (0, canvasHelper_1.drawBackground)(canvas2d, backgroundImage);
    yield canvas2d.draw({
        height: 300,
        width: 300,
        positionY: 70,
        positionX: 100,
        image: yield (0, canvas_1.loadImage)(pokeBoss.spriteUrl),
    });
    canvas2d.write({
        fillStyle: 'white',
        font: '22px Pokemon',
        positionX: 250,
        positionY: 45,
        textAlign: 'center',
        text: invasionSession.name,
    });
    // set up the table data
    const tableData = [
        [pokeBoss.hp.toString(), pokeBoss.atk.toString(), pokeBoss.def.toString()],
        [pokeBoss.speed.toString(), pokeBoss.spAtk.toString(), pokeBoss.spDef.toString()],
    ];
    // set up the table style
    const cellWidth = 80;
    const cellHeight = 55;
    // move the entire table to a new position
    const tableX = 295;
    const tableY = 415;
    for (let i = 0; i < tableData.length; i++) {
        const rowData = tableData[i];
        for (let j = 0; j < rowData.length; j++) {
            canvas2d.write({
                fillStyle: 'white',
                font: '15px Pokemon',
                positionX: tableX + j * cellWidth,
                positionY: tableY + i * cellHeight,
                text: rowData[j],
                textAlign: 'center',
            });
        }
    }
    const talentsPokemon1 = getTalents(pokeBoss);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const talentPokemon1 = talentsPokemon1[j + i * 3];
            if (!talentPokemon1)
                continue;
            canvas2d.draw({
                image: yield (0, canvasHelper_1.getTalent)(talentPokemon1),
                positionX: 67 + j * 45,
                positionY: 380 + i * 35,
                width: 30,
                height: 30,
            });
        }
    }
    const filepath = yield (0, fileHelper_1.saveFileOnDisk)(canvas2d);
    (0, fileHelper_1.removeFileFromDisk)(filepath);
    return filepath;
});
exports.iGenPokeBossInvasion = iGenPokeBossInvasion;
const getTalents = (pokemon) => {
    const talents = [];
    for (let i = 1; i <= 9; i++) {
        const talent = talentIdMap_1.talentIdMap.get(pokemon[`talentId${i}`]);
        talents.push(talent);
    }
    return talents;
};
//# sourceMappingURL=iGenPokeBossInvasion.js.map