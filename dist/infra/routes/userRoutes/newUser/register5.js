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
exports.register5 = void 0;
const tsyringe_1 = require("tsyringe");
const duelNXN_1 = require("../../../../server/modules/duel/duelNXN");
const AppErrors_1 = require("../../../errors/AppErrors");
const register5 = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
    const duel = yield (0, duelNXN_1.duelNXN)({
        leftTeam: [player.teamPoke1],
        rightTeam: [wildPokemon],
        wildBattle: true,
        staticImage: true,
        forceWin: true,
    });
    if (!duel)
        throw new AppErrors_1.UnexpectedError('Duelo não concluido');
    return {
        message: `[d] Você derrotou o ${wildPokemon.baseData.name} selvagem! 

    Utilize o comando "pz. buy poke-ball 1"
    Depois reaja nessa mensagem pra tentar capturá-lo!

    👍 - Jogar poke-bola
    `,
        status: 200,
        imageUrl: duel.imageUrl,
        isAnimated: true,
        data: null,
        actions: [`pz. start 6 ${wildPokemon.id}`],
    };
});
exports.register5 = register5;
//# sourceMappingURL=register5.js.map