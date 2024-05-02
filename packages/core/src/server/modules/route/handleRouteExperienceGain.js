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
exports.handleRouteExperienceGain = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const logger_1 = require("../../../infra/logger");
const handleRouteExperienceGain = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { route } = data;
    const expGain = getExperienceGain(data);
    const newExp = Math.round(route.experience + expGain / 7);
    const newLevel = Math.floor(Math.cbrt(newExp));
    const updatedRoute = yield src_1.default.gameRoom
        .update({
        where: {
            id: route.id,
        },
        data: {
            experience: newExp,
            level: newLevel,
        },
        include: {
            players: true,
        },
    })
        .catch(e => {
        logger_1.logger.error(e);
        throw new AppErrors_1.UnexpectedError('handleExperienceGain');
    });
    return {
        route: updatedRoute,
        leveledUp: newLevel !== route.level,
    };
});
exports.handleRouteExperienceGain = handleRouteExperienceGain;
const getExperienceGain = (data) => {
    const { targetPokemon, bonusExpMultiplier, route } = data;
    const b = targetPokemon.baseData.BaseExperience;
    const L = targetPokemon.level;
    const a = targetPokemon.ownerId === null ? 1 : 1.5;
    const e = bonusExpMultiplier ? 1 + bonusExpMultiplier : 1;
    const t = 1;
    const lowPopulatedRoomHandicap = 2 / route.players.length;
    const highLevelPenalty = Math.pow(((100 - route.level) / 100), 0.5) * 0.95 - Math.max(0, (route.level - 50) / 1100);
    return Math.round(((b * L) / 7) * e * a * t * lowPopulatedRoomHandicap * highLevelPenalty);
};
