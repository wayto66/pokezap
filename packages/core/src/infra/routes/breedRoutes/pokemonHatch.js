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
exports.pokemonHatch = void 0;
const src_1 = require("../../../../../image-generator/src");
const src_2 = __importDefault(require("../../../../../prisma-provider/src"));
const metaValues_1 = require("../../../constants/metaValues");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const getHoursDifference_1 = require("../../../server/helpers/getHoursDifference");
const pokemonHatch = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [, , pokemonIdString] = data.routeParams;
    const pokemonId = pokemonIdString ? Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1)) : 0;
    if (isNaN(pokemonId))
        throw new AppErrors_1.TypeMissmatchError(pokemonIdString, 'número');
    const player = yield src_2.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedPokemons: {
                include: {
                    baseData: true,
                },
            },
            gameRooms: {
                include: {
                    upgrades: {
                        include: {
                            base: true,
                        },
                    },
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const isLabEnhanced = player.gameRooms.some(groom => groom.upgrades.some((upg) => upg.base.name === 'lab'));
    console.log({ isLabEnhanced });
    let pokemon;
    if (pokemonIdString) {
        pokemon = yield src_2.default.pokemon.findFirst({
            where: {
                id: pokemonId,
                ownerId: player.id,
            },
            include: {
                baseData: true,
            },
        });
    }
    else {
        pokemon = player.ownedPokemons
            .filter(pokemon => !pokemon.isAdult)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
    }
    if (!pokemon)
        throw new AppErrors_1.PlayersPokemonNotFoundError(pokemonId, player.name);
    if ((0, getHoursDifference_1.getHoursDifference)(pokemon.createdAt, new Date()) < metaValues_1.metaValues.eggHatchingTimeInHours - (isLabEnhanced ? 12 : 0))
        throw new AppErrors_1.EggIsNotReadyToBeHatch(pokemon.id, metaValues_1.metaValues.eggHatchingTimeInHours - (0, getHoursDifference_1.getHoursDifference)(pokemon.createdAt, new Date()));
    const bornPokemon = yield src_2.default.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            isAdult: true,
            spriteUrl: pokemon.baseData.defaultSpriteUrl,
        },
        include: { baseData: true },
    });
    const parents = yield src_2.default.pokemon.findMany({
        where: {
            id: {
                in: [(_a = bornPokemon.parentId1) !== null && _a !== void 0 ? _a : 0, (_b = bornPokemon.parentId2) !== null && _b !== void 0 ? _b : 0],
            },
        },
        include: {
            baseData: true,
        },
    });
    const imageUrl = yield (0, src_1.iGenPokemonAnalysis)({
        pokemon: bornPokemon,
        parent1: parents[0],
        parent2: parents[1],
    });
    return {
        message: `#${pokemon.id} ${pokemon.baseData.name} nasceu! `,
        status: 200,
        data: null,
        imageUrl: imageUrl,
    };
});
exports.pokemonHatch = pokemonHatch;
