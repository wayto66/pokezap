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
exports.tradePoke2 = void 0;
const tsyringe_1 = require("tsyringe");
const checkEvolutionPermition_1 = require("../../../../server/modules/pokemon/checkEvolutionPermition");
const AppErrors_1 = require("../../../errors/AppErrors");
const tradePoke2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    if (!data.creatorPokemon.ownerId || !data.invitedPokemon.ownerId)
        return {
            message: `ERRO" `,
            status: 400,
            data: null,
        };
    if (data.creatorPokemon.teamSlot1 ||
        data.creatorPokemon.teamSlot2 ||
        data.creatorPokemon.teamSlot3 ||
        data.creatorPokemon.teamSlot4 ||
        data.creatorPokemon.teamSlot5 ||
        data.creatorPokemon.teamSlot6)
        throw new AppErrors_1.CantProceedWithPokemonInTeamError(data.creatorPokemon.id, data.creatorPokemon.baseData.name);
    if (data.invitedPokemon.teamSlot1 ||
        data.invitedPokemon.teamSlot2 ||
        data.invitedPokemon.teamSlot3 ||
        data.invitedPokemon.teamSlot4 ||
        data.invitedPokemon.teamSlot5 ||
        data.invitedPokemon.teamSlot6)
        throw new AppErrors_1.CantProceedWithPokemonInTeamError(data.invitedPokemon.id, data.invitedPokemon.baseData.name);
    yield (0, checkEvolutionPermition_1.checkEvolutionPermition)({
        playerId: data.creatorPokemon.ownerId,
        pokemonId: data.creatorPokemon.id,
        fromTrade: true,
    });
    yield (0, checkEvolutionPermition_1.checkEvolutionPermition)({
        playerId: data.invitedPokemon.ownerId,
        pokemonId: data.invitedPokemon.id,
        fromTrade: true,
    });
    yield prismaClient.$transaction([
        prismaClient.marketOffer.updateMany({
            where: {
                OR: [
                    {
                        pokemonDemand: {
                            some: {
                                id: data.creatorPokemon.id,
                            },
                        },
                    },
                    {
                        pokemonOffer: {
                            some: {
                                id: data.creatorPokemon.id,
                            },
                        },
                    },
                ],
            },
            data: {
                active: false,
            },
        }),
        prismaClient.marketOffer.updateMany({
            where: {
                OR: [
                    {
                        pokemonDemand: {
                            some: {
                                id: data.invitedPokemon.id,
                            },
                        },
                    },
                    {
                        pokemonOffer: {
                            some: {
                                id: data.invitedPokemon.id,
                            },
                        },
                    },
                ],
            },
            data: {
                active: false,
            },
        }),
        prismaClient.pokemon.update({
            where: {
                id: data.creatorPokemon.id,
            },
            data: {
                owner: {
                    connect: {
                        id: data.invitedPokemon.ownerId,
                    },
                },
            },
        }),
        prismaClient.pokemon.update({
            where: {
                id: data.invitedPokemon.id,
            },
            data: {
                owner: {
                    connect: {
                        id: data.creatorPokemon.ownerId,
                    },
                },
            },
        }),
        prismaClient.session.update({
            where: {
                id: data.session.id,
            },
            data: {
                isFinished: true,
            },
        }),
    ]);
    return {
        message: `Troca efetuada com sucesso!`,
        status: 200,
        data: null,
    };
});
exports.tradePoke2 = tradePoke2;
//# sourceMappingURL=tradePoke2.js.map