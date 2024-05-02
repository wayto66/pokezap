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
exports.generateWildPokemon = void 0;
const src_1 = __importDefault(require("../../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const talentNameMap_1 = require("../../../../server/constants/talentNameMap");
const generateGeneralStats_1 = require("../generateGeneralStats");
const generateHpStat_1 = require("../generateHpStat");
const generateWildPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { baseData, level, shinyChance, savage, isAdult, gameRoomId } = data;
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
    const regionalMultiplier = baseData.isRegional ? 1.05 : 1;
    if (isShiny) {
        const getTalentPossibilites = (baseData) => {
            return baseData.skills.map(skill => {
                if (skill.attackPower <= 40)
                    return {
                        type: skill.typeName,
                        reqCount: 1,
                    };
                if (skill.attackPower <= 80)
                    return {
                        type: skill.typeName,
                        reqCount: 2,
                    };
                return {
                    type: skill.typeName,
                    reqCount: 3,
                };
            });
        };
        const possibleTalents = getTalentPossibilites(baseData);
        let availableTalentSlots = 9;
        const talents = [];
        const finalTalentIds = [];
        if (baseData.type1Name) {
            talents.push({
                reqCount: 3,
                type: baseData.type1Name,
            });
            availableTalentSlots -= 3;
        }
        if (baseData.type2Name) {
            talents.push({
                reqCount: 3,
                type: baseData.type2Name,
            });
            availableTalentSlots -= 3;
        }
        for (const talent of talents) {
            const talentId = talentNameMap_1.talentNameMap.get(talent.type);
            if (!talentId)
                throw new AppErrors_1.UnexpectedError('Unabled to find talent id for type ' + talent.type);
            for (let i = 0; i < talent.reqCount; i++) {
                finalTalentIds.push(talentId);
            }
        }
        while (finalTalentIds.length < 9) {
            const newTalent = possibleTalents[Math.floor(Math.random() * possibleTalents.length)];
            const talentId = talentNameMap_1.talentNameMap.get(newTalent.type);
            if (!talentId)
                throw new AppErrors_1.UnexpectedError('Unabled to find talent id for type ' + newTalent.type);
            for (let i = 0; i < 3; i++) {
                finalTalentIds.push(talentId);
            }
            availableTalentSlots -= 3;
        }
        return yield src_1.default.pokemon.create({
            data: {
                basePokemonId: baseData.id,
                gameRoomId,
                savage: savage,
                level: level,
                experience: Math.pow(level, 3),
                isMale: Math.random() > 0.5,
                isShiny: true,
                isGiant: Math.random() < 0.1,
                spriteUrl: baseData.shinySpriteUrl,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level) * 1.15 * regionalMultiplier),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level) * 1.15 * regionalMultiplier),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level) * 1.15 * regionalMultiplier),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level) * 1.15 * regionalMultiplier),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level) * 1.15 * regionalMultiplier),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level) * 1.15 * regionalMultiplier),
                isAdult: isAdult,
                talentId1: finalTalentIds[0],
                talentId2: finalTalentIds[1],
                talentId3: finalTalentIds[2],
                talentId4: finalTalentIds[3],
                talentId5: finalTalentIds[4],
                talentId6: finalTalentIds[5],
                talentId7: finalTalentIds[6],
                talentId8: finalTalentIds[7],
                talentId9: finalTalentIds[8],
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
    return yield src_1.default.pokemon.create({
        data: {
            basePokemonId: baseData.id,
            gameRoomId,
            savage: savage,
            level: level,
            isGiant: Math.random() < 0.1,
            experience: Math.pow(level, 3),
            isMale: Math.random() > 0.5,
            spriteUrl: baseData.defaultSpriteUrl,
            hp: Math.round((0, generateHpStat_1.generateHpStat)(baseData.BaseHp, level) * regionalMultiplier),
            atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseAtk, level) * regionalMultiplier),
            def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseDef, level) * regionalMultiplier),
            spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpAtk, level) * regionalMultiplier),
            spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpDef, level) * regionalMultiplier),
            speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(baseData.BaseSpeed, level) * regionalMultiplier),
            isAdult: isAdult,
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
exports.generateWildPokemon = generateWildPokemon;
