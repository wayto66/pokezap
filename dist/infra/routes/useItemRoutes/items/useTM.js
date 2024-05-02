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
exports.useTM = void 0;
const tsyringe_1 = require("tsyringe");
const getPokemon_1 = require("../../../../server/helpers/getPokemon");
const AppErrors_1 = require("../../../errors/AppErrors");
const useTM = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const [, , , pokemonIdString] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParameterError('Nome/Id do Pokemon');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemon = yield (0, getPokemon_1.getPokemon)(prismaClient, pokemonIdString, player.id);
    if (!pokemon || !pokemon.isAdult)
        throw new AppErrors_1.PokemonNotFoundError(pokemonIdString);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    if (pokemon.TMs >= 3)
        throw new AppErrors_1.UnexpectedError('already 3 tms');
    const item = yield prismaClient.item.findFirst({
        where: {
            baseItem: {
                name: 'tm',
            },
            ownerId: player.id,
        },
    });
    if (!item || item.amount <= 0)
        throw new AppErrors_1.ItemNotFoundError('tm');
    yield prismaClient.$transaction([
        prismaClient.pokemon.update({
            where: {
                id: pokemon.id,
            },
            data: {
                TMs: {
                    increment: 1,
                },
            },
            include: {
                baseData: true,
                heldItem: {
                    include: {
                        baseItem: true,
                    },
                },
            },
        }),
        prismaClient.item.update({
            where: {
                id: item.id,
            },
            data: {
                amount: {
                    decrement: 1,
                },
            },
        }),
    ]);
    return {
        message: ``,
        react: '👌',
        status: 200,
        data: null,
    };
});
exports.useTM = useTM;
//# sourceMappingURL=useTM.js.map