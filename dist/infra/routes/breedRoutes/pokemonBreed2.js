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
exports.pokemonBreed2 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const iGenPokemonBreed_1 = require("../../../server/modules/imageGen/iGenPokemonBreed");
const breed_1 = require("../../../server/modules/pokemon/breed");
const pokemonBreed2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , pokemonId1String, pokemonId2String, desiredChildrenAmountString, confirm] = data.routeParams;
    const desiredChildrenAmount = Number(desiredChildrenAmountString);
    if (!pokemonId1String || !pokemonId2String)
        throw new AppErrors_1.MissingParametersBreedRouteError();
    if (isNaN(desiredChildrenAmount) || desiredChildrenAmount > 4)
        throw new AppErrors_1.InvalidChildrenAmountError();
    const pokemonId1 = Number(pokemonId1String.slice(pokemonId1String.indexOf('#') + 1));
    if (isNaN(pokemonId1))
        throw new AppErrors_1.TypeMissmatchError(pokemonId1String, 'number');
    const pokemonId2 = Number(pokemonId2String.slice(pokemonId2String.indexOf('#') + 1));
    if (isNaN(pokemonId2))
        throw new AppErrors_1.TypeMissmatchError(pokemonId2String, 'number');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemon1 = yield prismaClient.pokemon.findFirst({
        where: {
            id: pokemonId1,
            ownerId: player.id,
        },
        include: {
            baseData: true,
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
        },
    });
    if (!pokemon1)
        throw new AppErrors_1.PlayersPokemonNotFoundError(pokemonId1, player.name);
    const pokemon2 = yield prismaClient.pokemon.findFirst({
        where: {
            id: pokemonId2,
            ownerId: player.id,
        },
        include: {
            baseData: true,
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
        },
    });
    if (!pokemon2)
        throw new AppErrors_1.PlayersPokemonNotFoundError(pokemonId2, player.name);
    const getChildrenCount = (poke) => {
        if (!poke.childrenId1)
            return 0;
        if (!poke.childrenId2)
            return 1;
        if (!poke.childrenId3)
            return 2;
        if (!poke.childrenId4)
            return 3;
        return 4;
    };
    const poke1ChildrenCount = getChildrenCount(pokemon1);
    if (desiredChildrenAmount > 4 - poke1ChildrenCount)
        throw new AppErrors_1.PokemonAlreadyHasChildrenError(pokemon1.id, pokemon1.baseData.name, poke1ChildrenCount);
    const poke2ChildrenCount = getChildrenCount(pokemon2);
    if (desiredChildrenAmount > 4 - poke2ChildrenCount)
        throw new AppErrors_1.PokemonAlreadyHasChildrenError(pokemon2.id, pokemon2.baseData.name, poke2ChildrenCount);
    const getBreedingCosts = (poke, childrenCount) => {
        let finalCost = 0;
        let updatedChildrenCount = childrenCount + 1;
        for (let i = 0; i < desiredChildrenAmount; i++) {
            finalCost += (220 + (Math.pow(poke.baseData.BaseExperience, 2) / 231) * Math.pow(updatedChildrenCount, 3.23)) / 2.7;
            updatedChildrenCount++;
        }
        return finalCost;
    };
    const totalCost = Math.round(getBreedingCosts(pokemon1, poke1ChildrenCount) + getBreedingCosts(pokemon2, poke2ChildrenCount));
    const shardCost = Math.round(totalCost / 10);
    if (player.cash < totalCost)
        throw new AppErrors_1.InsufficientFundsError(player.name, player.cash, totalCost);
    if (player.pokeShards < shardCost)
        throw new AppErrors_1.InsufficientShardsError(player.name, player.pokeShards, shardCost);
    if (confirm === 'CONFIRM') {
        yield prismaClient.player.update({
            where: {
                id: player.id,
            },
            data: {
                cash: {
                    decrement: totalCost,
                },
                pokeShards: {
                    decrement: shardCost,
                },
            },
        });
        let updatedPoke1ChildrenCount = poke1ChildrenCount;
        let updatedPoke2ChildrenCount = poke2ChildrenCount;
        for (let i = 0; i < desiredChildrenAmount; i++) {
            const newBaby = yield (0, breed_1.breed)({
                poke1: pokemon1,
                poke2: pokemon2,
            });
            if (typeof newBaby === 'string') {
                return {
                    message: newBaby,
                    status: 200,
                    data: null,
                };
            }
            const updateChildrenData = (counter) => {
                if (counter === 0) {
                    counter++;
                    return { childrenId1: newBaby.id };
                }
                if (counter === 1) {
                    counter++;
                    return { childrenId2: newBaby.id };
                }
                if (counter === 2) {
                    counter++;
                    return { childrenId3: newBaby.id };
                }
                if (counter === 3) {
                    counter++;
                    return { childrenId4: newBaby.id };
                }
                throw new AppErrors_1.UnexpectedError('pokemonBreed2');
            };
            yield prismaClient.pokemon.update({
                where: {
                    id: pokemon1.id,
                },
                data: updateChildrenData(updatedPoke1ChildrenCount),
            });
            yield prismaClient.pokemon.update({
                where: {
                    id: pokemon2.id,
                },
                data: updateChildrenData(updatedPoke2ChildrenCount),
            });
            const zapClient = tsyringe_1.container.resolve('ZapClientInstance1');
            yield zapClient.sendMessage(data.groupCode, `#${newBaby.id} foi gerado por breed de #${pokemon1.id} ${pokemon1.baseData.name} e #${pokemon2.id} ${pokemon2.baseData.name}`);
            updatedPoke1ChildrenCount++;
            updatedPoke2ChildrenCount++;
        }
        return {
            message: ``,
            status: 200,
            data: null,
        };
    }
    const imageUrl = yield (0, iGenPokemonBreed_1.iGenPokemonBreed)({
        pokemon1: pokemon1,
        pokemon2: pokemon2,
    });
    return {
        message: `Para realizar o breed de ${desiredChildrenAmount} filhotes, será necessário pagar ${totalCost} POKECOINS. 
    
    👍 - CONFIRMAR`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [`pokezap. breed ${pokemon1.id} ${pokemon2.id} ${desiredChildrenAmount} confirm`],
    };
});
exports.pokemonBreed2 = pokemonBreed2;
//# sourceMappingURL=pokemonBreed2.js.map