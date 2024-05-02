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
exports.register6 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../errors/AppErrors");
const register6 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString] = data.routeParams;
    const wildPokemonId = Number(pokemonIdString);
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: {
                include: {
                    baseData: {
                        include: {
                            skills: true,
                        },
                    },
                    heldItem: {
                        include: {
                            baseItem: true,
                        },
                    },
                },
            },
            ownedItems: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    const wildPokemon = yield prismaClient.pokemon.findUnique({
        where: {
            id: wildPokemonId,
        },
        include: {
            baseData: {
                include: {
                    skills: true,
                },
            },
        },
    });
    if (!player || !wildPokemon)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player.teamPoke1)
        throw new AppErrors_1.UnexpectedError('Não há um pokemon em seu time');
    if (!player.ownedItems.some(item => item.baseItem.name === 'poke-ball'))
        throw new AppErrors_1.PlayerDoesNotHaveItemError(player.name, 'poke-ball');
    yield prismaClient.pokemon.update({
        where: {
            id: wildPokemon.id,
        },
        data: {
            savage: false,
            ownerId: player.id,
        },
    });
    yield prismaClient.player.update({
        where: {
            id: player.id,
        },
        data: {
            caughtDbIds: {
                push: wildPokemon.baseData.id,
            },
            caughtDexIds: {
                push: wildPokemon.baseData.pokedexId,
            },
        },
    });
    return {
        message: `[d] Parabéns ${player.name}! Você capturou o *${wildPokemon.baseData.name}*!
    
    Agora, vou sugerir alguns comandos para você conhecer:
    pz. inventory poke  (Para ver todos seus pokemons)
    pz. inventory item   (Para ver todos seus itens)
    pz. team     (Para ver seu time atual)
    pz. team ${wildPokemon.baseData.name} ${player.teamPoke1.baseData.name} (para remontar seu time)
    pz. team ${wildPokemon.id} ${player.teamPoke1.id} (para remontar seu time, pelos IDs dos pokemons)
    pz. loja  (comprar itens)
    pz. help`,
        status: 200,
        data: null,
    };
});
exports.register6 = register6;
//# sourceMappingURL=register6.js.map