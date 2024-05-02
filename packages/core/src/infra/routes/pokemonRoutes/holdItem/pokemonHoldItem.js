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
exports.pokemonHoldItem = void 0;
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonHoldItem = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString, itemNameUppercase] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParameterError('Nome/Id do Pokemon e nome do Item');
    if (!itemNameUppercase)
        throw new AppErrors_1.MissingParameterError('Nome/Id do Pokemon e nome do Item');
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const player = yield prisma.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
        onlyAdult: true,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield prisma.pokemon.findFirst({
        where: pokemonRequestData.where,
        include: {
            baseData: true,
            owner: true,
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    if (!pokemon || !pokemon.isAdult)
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (pokemon.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(pokemon.id, player.name);
    const item = yield prisma.item.findFirst({
        where: {
            baseItem: {
                name: itemNameUppercase.toLowerCase(),
            },
            ownerId: player.id,
        },
    });
    if (!item || item.amount <= 0)
        throw new AppErrors_1.ItemNotFoundError(itemNameUppercase);
    if (pokemon.heldItem) {
        yield prisma.$transaction([
            prisma.item.upsert({
                create: {
                    amount: 1,
                    name: pokemon.heldItem.baseItem.name,
                    ownerId: player.id,
                },
                update: {
                    amount: {
                        increment: 1,
                    },
                },
                where: {
                    ownerId_name: {
                        ownerId: player.id,
                        name: pokemon.heldItem.baseItem.name,
                    },
                },
            }),
            prisma.pokemon.update({
                where: {
                    id: pokemon.id,
                },
                data: {
                    heldItemId: null,
                    heldItem: {
                        disconnect: true,
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
        ]);
    }
    yield prisma.$transaction([
        prisma.pokemon.update({
            where: {
                id: pokemon.id,
            },
            data: {
                heldItem: {
                    connectOrCreate: {
                        where: {
                            holderId_name: {
                                holderId: pokemon.id,
                                name: item.name,
                            },
                        },
                        create: {
                            name: item.name,
                        },
                    },
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
        prisma.item.update({
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
exports.pokemonHoldItem = pokemonHoldItem;
