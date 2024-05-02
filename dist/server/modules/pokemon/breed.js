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
exports.breed = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const evoDataIdMap_1 = require("../../../server/constants/evoDataIdMap");
const getRandomBetween2_1 = require("../../../server/helpers/getRandomBetween2");
const getRandomBetween3_1 = require("../../../server/helpers/getRandomBetween3");
const generateGeneralStats_1 = require("./generateGeneralStats");
const generateHpStat_1 = require("./generateHpStat");
const breed = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    console.log(data.poke1.baseData.id);
    console.log(data.poke2.baseData.id);
    const babyId1 = evoDataIdMap_1.evoDataIdMap.get(data.poke1.baseData.id);
    const babyId2 = evoDataIdMap_1.evoDataIdMap.get(data.poke2.baseData.id);
    const babyBaseDataId = yield (0, getRandomBetween2_1.getRandomBetween2)({
        obj1: [babyId1, 0.5],
        obj2: [babyId2, 0.5],
    });
    if (!babyBaseDataId)
        throw new AppErrors_1.FailedToFindXinYError('babyBaseDataId', 'breed-module');
    const babyBaseData = yield prismaClient.basePokemon.findFirst({
        where: {
            id: babyBaseDataId,
        },
    });
    let giantChance = 0;
    if (data.poke1.isGiant)
        giantChance += 0.2;
    if (data.poke2.isGiant)
        giantChance += 0.2;
    if (!babyBaseData)
        throw new AppErrors_1.FailedToFindXinYError('babyBaseData', 'breed-module');
    const babyPoke = yield prismaClient.pokemon.create({
        data: {
            basePokemonId: babyBaseDataId,
            spriteUrl: './src/assets/sprites/eggs/default.png',
            hp: (0, generateHpStat_1.generateHpStat)(babyBaseData.BaseHp, 1),
            atk: (0, generateGeneralStats_1.generateGeneralStats)(babyBaseData.BaseAtk, 1),
            def: (0, generateGeneralStats_1.generateGeneralStats)(babyBaseData.BaseDef, 1),
            spAtk: (0, generateGeneralStats_1.generateGeneralStats)(babyBaseData.BaseSpAtk, 1),
            spDef: (0, generateGeneralStats_1.generateGeneralStats)(babyBaseData.BaseSpDef, 1),
            speed: (0, generateGeneralStats_1.generateGeneralStats)(babyBaseData.BaseSpeed, 1),
            isAdult: false,
            savage: false,
            isMale: Math.random() > 0.5,
            isGiant: Math.random() < giantChance,
            level: 1,
            ownerId: data.poke1.ownerId,
            parentId1: data.poke1.id,
            parentId2: data.poke2.id,
            talentId1: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId1, 0.4875],
                obj2: [data.poke2.talentId1, 0.4875],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId2: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId2, 0.475],
                obj2: [data.poke2.talentId2, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId3: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId3, 0.475],
                obj2: [data.poke2.talentId3, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId4: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId4, 0.475],
                obj2: [data.poke2.talentId4, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId5: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId5, 0.475],
                obj2: [data.poke2.talentId5, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId6: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId6, 0.475],
                obj2: [data.poke2.talentId6, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId7: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId7, 0.475],
                obj2: [data.poke2.talentId7, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId8: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId8, 0.475],
                obj2: [data.poke2.talentId8, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
            talentId9: (0, getRandomBetween3_1.getRandomBetween3)({
                obj1: [data.poke1.talentId9, 0.475],
                obj2: [data.poke2.talentId9, 0.475],
                obj3: [Math.ceil(Math.random() * 18), 0.025],
            }),
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
    return babyPoke;
});
exports.breed = breed;
//# sourceMappingURL=breed.js.map