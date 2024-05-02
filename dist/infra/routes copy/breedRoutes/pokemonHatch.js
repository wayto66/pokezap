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
exports.pokemonHatch = void 0;
const tsyringe_1 = require("tsyringe");
const metaValues_1 = require("../../../constants/metaValues");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const getHoursDifference_1 = require("../../../server/helpers/getHoursDifference");
const iGenPokemonAnalysis_1 = require("../../../server/modules/imageGen/iGenPokemonAnalysis");
const pokemonHatch = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , pokemonIdString] = data.routeParams;
    const pokemonId = pokemonIdString ? Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1)) : 0;
    if (isNaN(pokemonId))
        throw new AppErrors_1.TypeMissmatchError(pokemonIdString, 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
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
    const isLabEnhanced = player.gameRooms[0].upgrades.some((upg) => upg.base.name === 'lab');
    let pokemon;
    if (pokemonIdString) {
        pokemon = yield prismaClient.pokemon.findFirst({
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
    const bornPokemon = yield prismaClient.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            isAdult: true,
            spriteUrl: pokemon.baseData.defaultSpriteUrl,
        },
        include: { baseData: true },
    });
    const imageUrl = yield (0, iGenPokemonAnalysis_1.iGenPokemonAnalysis)(bornPokemon);
    return {
        message: `#${pokemon.id} ${pokemon.baseData.name} nasceu! `,
        status: 200,
        data: null,
        imageUrl: imageUrl,
    };
});
exports.pokemonHatch = pokemonHatch;
//# sourceMappingURL=pokemonHatch.js.map