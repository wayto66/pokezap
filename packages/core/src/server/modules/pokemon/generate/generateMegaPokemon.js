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
exports.generateMegaPokemon = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const talentNameMap_1 = require("../../../constants/talentNameMap");
const getRandomBetween2_1 = require("../../../helpers/getRandomBetween2");
const generateGeneralStats_1 = require("../generateGeneralStats");
const generateHpStat_1 = require("../generateHpStat");
const generateMegaPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, level, shinyChance } = data;
    const baseData = yield src_1.default.basePokemon.findFirst({
        where: {
            name,
        },
    });
    if (!baseData)
        throw new AppErrors_1.UnexpectedError('No basePokemon found for ' + name);
    const isShiny = Math.random() < shinyChance;
    const random1 = Math.max(Math.ceil(Math.random() * 18), 1);
    const random2 = Math.max(Math.ceil(Math.random() * 18), 1);
    const random3 = Math.max(Math.ceil(Math.random() * 18), 1);
    const talentIds = [random1, random1, random1, random2, random2, random2, random3, random3, random3];
    if (isShiny) {
        const talentId1 = talentNameMap_1.talentNameMap.get(baseData.type1Name);
        const talentId2 = talentNameMap_1.talentNameMap.get(baseData.type2Name || baseData.type1Name);
        return yield src_1.default.raidPokemon.create({
            data: {
                basePokemonId: baseData.id,
                level: level,
                isShiny: true,
                spriteUrl: baseData.shinySpriteUrl,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level) * 1.2),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level) * 1.2),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level) * 1.2),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level) * 1.2),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level) * 1.2),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level) * 1.2),
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
                baseData: {
                    include: {
                        skills: true,
                    },
                },
            },
        });
    }
    return yield src_1.default.raidPokemon.create({
        data: {
            basePokemonId: baseData.id,
            level: level,
            spriteUrl: baseData.defaultSpriteUrl,
            hp: Math.round((0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level) * 1.1),
            atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level) * 1.1),
            def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level) * 1.1),
            spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level) * 1.1),
            spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level) * 1.1),
            speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level) * 1.1),
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
            baseData: {
                include: {
                    skills: true,
                },
            },
        },
    });
});
exports.generateMegaPokemon = generateMegaPokemon;
