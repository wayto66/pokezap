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
exports.spawnTutorialPokemon = void 0;
const tsyringe_1 = require("tsyringe");
const iGenWildPokemon_1 = require("../imageGen/iGenWildPokemon");
const generateWildPokemon_1 = require("./generate/generateWildPokemon");
const spawnTutorialPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const baseExperienceTreshold = Math.floor(64 + (1 / 100) * 276);
    const basePokemons = yield prismaClient.basePokemon.findMany({
        where: {
            BaseExperience: {
                lte: baseExperienceTreshold,
            },
            isMega: false,
            isRegional: false,
            isFirstEvolution: true,
        },
        include: {
            skills: true,
        },
    });
    const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)];
    const level = 1;
    const wildPokemon = yield (0, generateWildPokemon_1.generateWildPokemon)({
        baseData,
        level,
        shinyChance: 0,
        savage: true,
        isAdult: true,
        gameRoomId: data.gameRoom.id,
    });
    const imageUrl = yield (0, iGenWildPokemon_1.iGenWildPokemon)({
        pokemon: wildPokemon,
    });
    return { pokemon: wildPokemon, imageUrl };
});
exports.spawnTutorialPokemon = spawnTutorialPokemon;
//# sourceMappingURL=spawnTutorialPokemon.js.map