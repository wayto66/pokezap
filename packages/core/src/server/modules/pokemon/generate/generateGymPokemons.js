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
exports.generateGymPokemons = void 0;
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const talentNameMap_1 = require("../../../constants/talentNameMap");
const getRandomBetween2_1 = require("../../../helpers/getRandomBetween2");
const generateGeneralStats_1 = require("../generateGeneralStats");
const generateHpStat_1 = require("../generateHpStat");
prisma;
const generateGymPokemons = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, level, ownerId } = data;
    const baseData = yield prisma.basePokemon.findFirst({
        where: {
            name,
        },
    });
    if (!baseData)
        throw new AppErrors_1.UnexpectedError('No basePokemon found for : ' + name);
    const talentId1 = talentNameMap_1.talentNameMap.get(baseData.type1Name);
    const talentId2 = talentNameMap_1.talentNameMap.get(baseData.type2Name || baseData.type1Name);
    return yield prisma.gymPokemon.create({
        data: {
            basePokemonName: baseData.name,
            ownerId,
            level: level,
            isShiny: true,
            spriteUrl: baseData.shinySpriteUrl,
            hp: Math.round((0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level) * 1.15),
            atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level) * 1.15),
            def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level) * 1.15),
            spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level) * 1.15),
            spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level) * 1.15),
            speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level) * 1.15),
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
});
exports.generateGymPokemons = generateGymPokemons;
