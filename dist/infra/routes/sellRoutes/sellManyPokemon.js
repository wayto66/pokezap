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
exports.sellManyPokemon = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../errors/AppErrors");
var FilterTypes;
(function (FilterTypes) {
    FilterTypes[FilterTypes["EGG"] = 0] = "EGG";
    FilterTypes[FilterTypes["EGGS"] = 1] = "EGGS";
})(FilterTypes || (FilterTypes = {}));
const sellManyPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , filterType, valueString] = data.routeParams;
    if (!['EGG', 'EGGS'].includes(filterType))
        throw new AppErrors_1.UnexpectedError('Apenas permitido o filtro "egg"');
    if (!valueString)
        throw new AppErrors_1.MissingParameterError('Quantidade mínima de ovos para vender o pokemon');
    const value = Number(valueString);
    if (isNaN(value))
        throw new AppErrors_1.TypeMissmatchError(valueString, 'NÚMERO');
    if (![2, 3, 4].includes(value))
        throw new AppErrors_1.UnexpectedError('Só é permitido valores: 2, 3 ou 4');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedPokemons: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemons = yield prismaClient.pokemon.findMany({
        where: {
            childrenId1: {
                not: null,
            },
            childrenId2: {
                not: null,
            },
            childrenId3: {
                [value > 2 ? 'equals' : 'not']: null,
            },
            childrenId4: {
                [value > 3 ? 'equals' : 'not']: null,
            },
            ownerId: player.id,
            isAdult: true,
        },
        include: {
            baseData: true,
            teamSlot1: true,
            teamSlot2: true,
            teamSlot3: true,
            teamSlot4: true,
            teamSlot5: true,
            teamSlot6: true,
            owner: true,
        },
    });
    if (pokemons.length === 0)
        throw new AppErrors_1.ZeroPokemonsFoundError();
    let totalCash = 0;
    for (const pokemon of pokemons) {
        if (pokemon.ownerId !== player.id)
            throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
        if (pokemon.teamSlot1 ||
            pokemon.teamSlot2 ||
            pokemon.teamSlot3 ||
            pokemon.teamSlot4 ||
            pokemon.teamSlot5 ||
            pokemon.teamSlot6)
            throw new AppErrors_1.CantSellPokemonInTeamError(pokemon.id);
        const pokemonSellPrice = Math.floor(35 + (Math.pow(pokemon.level, 2) / 150) * 100 + (Math.pow(pokemon.baseData.BaseExperience, 2) / 1200) * 50);
        totalCash += pokemonSellPrice;
    }
    if (data.fromReact && data.routeParams[data.routeParams.length - 1] === 'CONFIRM') {
        yield prismaClient.pokemon.updateMany({
            where: {
                id: {
                    in: pokemons.map(p => p.id),
                },
            },
            data: {
                ownerId: null,
                gameRoomId: null,
                statusTrashed: true,
            },
        });
        yield prismaClient.player.update({
            where: {
                id: player.id,
            },
            data: {
                cash: {
                    increment: totalCash,
                },
            },
        });
        return {
            message: `${data.playerName} vendeu ${pokemons
                .map(poke => {
                return `#${poke.id} ${poke.baseData.name}`;
            })
                .join(', ')} e obteve $${totalCash}.`,
            status: 200,
            data: null,
        };
    }
    return {
        message: `Deseja vender ${pokemons
            .map(poke => {
            return `#${poke.id} ${poke.baseData.name}`;
        })
            .join(', ')} por $${totalCash}?
    👍 - CONFIRMAR`,
        status: 200,
        data: null,
        actions: [`pz. sell poke ${pokemons.map(poke => poke.id).join(' ')} confirm`],
    };
});
exports.sellManyPokemon = sellManyPokemon;
//# sourceMappingURL=sellManyPokemon.js.map