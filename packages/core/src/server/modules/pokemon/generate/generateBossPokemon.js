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
exports.generateBossPokemon = void 0;
const talentNameMap_1 = require("../../../constants/talentNameMap");
const getRandomBetween2_1 = require("../../../helpers/getRandomBetween2");
const generateGeneralStats_1 = require("../generateGeneralStats");
const generateHpStat_1 = require("../generateHpStat");
const generateBossPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { baseData, level, shinyChance, savage, gameRoomId } = data;
    const isShiny = Math.random() < shinyChance;
    const talentIds = data.talentIds
        ? data.talentIds
        : [
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
            Math.max(Math.ceil(Math.random() * 18), 1),
        ];
    if (isShiny) {
        const talentId1 = talentNameMap_1.talentNameMap.get(baseData.type1Name);
        const talentId2 = talentNameMap_1.talentNameMap.get(baseData.type2Name || baseData.type1Name);
        return yield prisma.pokemon.create({
            data: {
                basePokemonId: baseData.id,
                gameRoomId,
                savage: savage,
                level: level,
                experience: Math.pow(level, 3),
                isMale: Math.random() > 0.5,
                isShiny: true,
                spriteUrl: baseData.shinySpriteUrl,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level) * 1.15),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level) * 1.15),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level) * 1.15),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level) * 1.15),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level) * 1.15),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level) * 1.15),
                isAdult: true,
                talentId1: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId2: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId3: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId4: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId5: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId6: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId7: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId8: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
                talentId9: (0, getRandomBetween2_1.getRandomBetween2)({ obj1: [talentId1, 0.5], obj2: [talentId2, 0.5] }),
            },
            include: {
                baseData: true,
                talent1: true,
                talent2: true,
                talent3: true,
                talent4: true,
                talent5: true,
                talent6: true,
                talent7: true,
                talent8: true,
                talent9: true,
            },
        });
    }
    return yield prisma.pokemon.create({
        data: {
            basePokemonId: baseData.id,
            gameRoomId,
            savage: savage,
            level: level,
            experience: Math.pow(level, 3),
            isMale: Math.random() > 0.5,
            spriteUrl: baseData.defaultSpriteUrl,
            hp: (0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level),
            atk: (0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level),
            def: (0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level),
            spAtk: (0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level),
            spDef: (0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level),
            speed: (0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level),
            isAdult: true,
            talentId1: talentIds[0],
            talentId2: talentIds[1],
            talentId3: talentIds[2],
            talentId4: talentIds[3],
            talentId5: talentIds[4],
            talentId6: talentIds[5],
            talentId7: talentIds[6],
            talentId8: talentIds[7],
            talentId9: talentIds[8],
        },
        include: {
            baseData: true,
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
        },
    });
});
exports.generateBossPokemon = generateBossPokemon;
