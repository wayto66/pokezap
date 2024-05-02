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
exports.tradePokeEvolutionTrigger = void 0;
const tsyringe_1 = require("tsyringe");
const tradePokeEvolutionTrigger = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    if (!data.creatorPokemon.ownerId || !data.invitedPokemon.ownerId)
        return {
            message: `ERRO" `,
            status: 400,
            data: null,
        };
    yield prismaClient.pokemon.update({
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
    });
    yield prismaClient.pokemon.update({
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
    });
    yield prismaClient.session.update({
        where: {
            id: data.session.id,
        },
        data: {
            isFinished: true,
        },
    });
    return {
        message: `Troca efetuada com sucesso!`,
        status: 200,
        data: null,
    };
});
exports.tradePokeEvolutionTrigger = tradePokeEvolutionTrigger;
//# sourceMappingURL=tradePokeEvolutionTrigger.js.map