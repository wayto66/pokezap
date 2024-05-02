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
exports.handleExperienceGain = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const generateGeneralStats_1 = require("./generateGeneralStats");
const generateHpStat_1 = require("./generateHpStat");
const experiencePenaltyByLevel = (level) => {
    if (level > 75)
        return 0.4;
    if (level > 50)
        return 0.66;
    return 1;
};
const handleExperienceGain = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const divideFactor = data.divide ? 0.5 : 1;
    const expGain = Math.round(getExperienceGain(data) * divideFactor * experiencePenaltyByLevel(data.pokemon.level));
    const newExp = data.pokemon.experience + expGain;
    const newLevel = Math.floor(Math.cbrt(newExp));
    const pokemon = yield src_1.default.pokemon.findFirst({
        where: {
            id: data.pokemon.id,
        },
        include: {
            baseData: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(data.pokemon.id);
    if (pokemon.isShiny || pokemon.baseData.isRegional) {
        const multiplier = pokemon.isShiny ? 1.15 : 1.05;
        const updatedPokemon = yield src_1.default.pokemon
            .update({
            where: {
                id: pokemon.id,
            },
            data: {
                experience: newExp,
                level: newLevel,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(pokemon.baseData.BaseHp, newLevel) * multiplier),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseAtk, newLevel) * multiplier),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseDef, newLevel) * multiplier),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpAtk, newLevel) * multiplier),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpDef, newLevel) * multiplier),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpeed, newLevel) * multiplier),
            },
            include: {
                baseData: true,
            },
        })
            .catch(e => {
            logger_1.logger.error(e);
            throw new AppErrors_1.UnexpectedError('handleExperienceGain');
        });
        return {
            pokemon: updatedPokemon,
            leveledUp: newLevel !== pokemon.level,
        };
    }
    const updatedPokemon = yield src_1.default.pokemon
        .update({
        where: {
            id: pokemon.id,
        },
        data: {
            experience: newExp,
            level: newLevel,
            hp: (0, generateHpStat_1.generateHpStat)(pokemon.baseData.BaseHp, newLevel),
            atk: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseAtk, newLevel),
            def: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseDef, newLevel),
            spAtk: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpAtk, newLevel),
            spDef: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpDef, newLevel),
            speed: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpeed, newLevel),
        },
        include: {
            baseData: true,
        },
    })
        .catch(e => {
        logger_1.logger.error(e);
        throw new AppErrors_1.UnexpectedError('handleExperienceGain');
    });
    return {
        pokemon: updatedPokemon,
        leveledUp: newLevel !== pokemon.level,
    };
});
exports.handleExperienceGain = handleExperienceGain;
const getExperienceGain = (data) => {
    const { targetPokemon, bonusExp, pokemon } = data;
    const b = targetPokemon.baseData.BaseExperience;
    const L = targetPokemon.level;
    const a = 'ownerId' in targetPokemon ? 1 : 1.5;
    const e = bonusExp ? 1 + bonusExp : 1;
    const t = 1;
    const highLevelPenalty = Math.pow(((100 - pokemon.level) / 100), 0.5) * 0.95 - Math.max(0, (pokemon.level - 50) / 1100);
    return Math.round(((b * L) / 7) * e * a * t * highLevelPenalty);
};
