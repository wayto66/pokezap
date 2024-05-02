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
exports.windPokeEvolve = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const bossPokemonNames_1 = require("../../constants/bossPokemonNames");
const generateGeneralStats_1 = require("./generateGeneralStats");
const generateHpStat_1 = require("./generateHpStat");
const windPokeEvolve = (poke, maximumBaseExperience) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const fullData = poke.baseData.evolutionData;
    const evData = fullData.evolutionChain[0];
    if (!evData)
        return poke;
    const getCurrentPosition = () => {
        var _a, _b, _c;
        if (poke.baseData.isFirstEvolution)
            return 0;
        if (poke.baseData.name === ((_a = evData === null || evData === void 0 ? void 0 : evData.species) === null || _a === void 0 ? void 0 : _a.name))
            return 1;
        if (poke.baseData.name === ((_c = (_b = evData === null || evData === void 0 ? void 0 : evData.evolves_to[0]) === null || _b === void 0 ? void 0 : _b.species) === null || _c === void 0 ? void 0 : _c.name))
            return 2;
        return -1;
    };
    const currentPosition = getCurrentPosition();
    if (currentPosition === 2)
        return poke;
    if (currentPosition === -1)
        return poke;
    let evoData = null;
    if (currentPosition === 0)
        evoData = evData;
    if (currentPosition === 1)
        evoData = evData.evolves_to[0];
    if (evoData === null)
        return poke;
    const evoTrigger = (_a = evoData === null || evoData === void 0 ? void 0 : evoData.evolution_details[0]) === null || _a === void 0 ? void 0 : _a.trigger;
    if (!evoTrigger)
        return poke;
    const evoToPoke = yield src_1.default.basePokemon.findFirst({
        where: {
            name: evoData.species.name,
        },
    });
    if (!evoToPoke)
        return poke;
    if (evoToPoke.BaseExperience > maximumBaseExperience)
        return poke;
    if (evoTrigger.name === 'level-up' && poke.level < (evoData.evolution_details[0].min_level || 15))
        return poke;
    if (bossPokemonNames_1.bossPokemonNames.includes(evoToPoke.name))
        return poke;
    const evolvedPoke = poke.isShiny
        ? yield src_1.default.pokemon.update({
            where: {
                id: poke.id,
            },
            data: {
                baseData: {
                    connect: {
                        id: evoToPoke.id,
                    },
                },
                spriteUrl: evoToPoke.shinySpriteUrl,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(evoToPoke.BaseHp, poke.level) * 1.1),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseAtk, poke.level) * 1.1),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseDef, poke.level) * 1.1),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpAtk, poke.level) * 1.1),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpDef, poke.level) * 1.1),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpeed, poke.level) * 1.1),
            },
            include: {
                baseData: true,
            },
        })
        : yield src_1.default.pokemon.update({
            where: {
                id: poke.id,
            },
            data: {
                baseData: {
                    connect: {
                        id: evoToPoke.id,
                    },
                },
                spriteUrl: evoToPoke.defaultSpriteUrl,
                hp: (0, generateHpStat_1.generateHpStat)(evoToPoke.BaseHp, poke.level),
                atk: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseAtk, poke.level),
                def: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseDef, poke.level),
                spAtk: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpAtk, poke.level),
                spDef: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpDef, poke.level),
                speed: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpeed, poke.level),
            },
            include: {
                baseData: true,
            },
        });
    return evolvedPoke;
});
exports.windPokeEvolve = windPokeEvolve;
