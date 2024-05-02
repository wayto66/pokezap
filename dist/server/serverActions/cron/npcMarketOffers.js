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
exports.npcMarketOffers = void 0;
const tsyringe_1 = require("tsyringe");
const generateWildPokemon_1 = require("../../modules/pokemon/generate/generateWildPokemon");
const npcMarketOffers = () => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const announcedPokemons = yield prismaClient.pokemon.findMany({
        where: {
            isAnnouncedInMarket: true,
        },
        include: {
            baseData: true,
            skills: true,
        },
    });
    const basePokemons = yield prismaClient.basePokemon.findMany({
        where: {},
        include: {
            skills: true,
        },
    });
    const getOffer = (pokemon, basePokemons) => {
        const filteredBasePokemons = basePokemons.filter(p => p.BaseAllStats <= pokemon.baseData.BaseAllStats * 0.8 && p.BaseAllStats > pokemon.baseData.BaseAllStats * 0.1);
        return filteredBasePokemons[Math.floor(Math.random() * filteredBasePokemons.length)];
    };
    yield prismaClient.marketOffer.deleteMany({
        where: {
            pokemonDemand: {
                some: {
                    id: {
                        in: announcedPokemons.map(p => p.id),
                    },
                },
            },
        },
    });
    for (const announcedPokemon of announcedPokemons) {
        const pokemonToOffer = yield (0, generateWildPokemon_1.generateWildPokemon)({
            baseData: getOffer(announcedPokemon, basePokemons),
            level: announcedPokemon.level,
            isAdult: true,
            savage: false,
            shinyChance: announcedPokemon.isShiny ? 1 : 0,
        });
        const offer = yield prismaClient.marketOffer.create({
            data: {
                creatorId: Math.floor(Math.random() * 200 + 50),
                demandPlayerId: announcedPokemon.ownerId || 0,
                pokemonOffer: {
                    connect: {
                        id: pokemonToOffer.id,
                    },
                },
                pokemonDemand: {
                    connect: {
                        id: announcedPokemon.id,
                    },
                },
            },
        });
    }
});
exports.npcMarketOffers = npcMarketOffers;
//# sourceMappingURL=npcMarketOffers.js.map