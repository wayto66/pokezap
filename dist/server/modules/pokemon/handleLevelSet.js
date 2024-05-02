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
exports.handleLevelSet = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const generateGeneralStats_1 = require("./generateGeneralStats");
const generateHpStat_1 = require("./generateHpStat");
const handleLevelSet = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const { targetLevel } = data;
    const pokemon = yield prisma.pokemon.findFirst({
        where: {
            id: data.pokemon.id,
        },
        include: {
            baseData: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(data.pokemon.id);
    const updatedPokemon = yield prisma.pokemon
        .update({
        where: {
            id: pokemon.id,
        },
        data: {
            experience: Math.pow(targetLevel, 3),
            level: targetLevel,
            hp: (0, generateHpStat_1.generateHpStat)(pokemon.baseData.BaseHp, targetLevel),
            atk: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseAtk, targetLevel),
            def: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseDef, targetLevel),
            spAtk: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpAtk, targetLevel),
            spDef: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpDef, targetLevel),
            speed: (0, generateGeneralStats_1.generateGeneralStats)(pokemon.baseData.BaseSpeed, targetLevel),
            isInDaycare: !data.removeFromDaycare,
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
        leveledUp: true,
    };
});
exports.handleLevelSet = handleLevelSet;
//# sourceMappingURL=handleLevelSet.js.map