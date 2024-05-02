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
exports.raidTeam = void 0;
const tsyringe_1 = require("tsyringe");
const iGenPokemonTeam_1 = require("../../../server/modules/imageGen/iGenPokemonTeam");
const AppErrors_1 = require("../../errors/AppErrors");
const raidTeam = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , id1, id2, id3, id4, id5, id6] = data.routeParams;
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
            teamPoke1: {
                include: {
                    baseData: true,
                },
            },
            teamPoke2: {
                include: {
                    baseData: true,
                },
            },
            teamPoke3: {
                include: {
                    baseData: true,
                },
            },
            teamPoke4: {
                include: {
                    baseData: true,
                },
            },
            teamPoke5: {
                include: {
                    baseData: true,
                },
            },
            teamPoke6: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    if (!id1) {
        const imageUrl = yield (0, iGenPokemonTeam_1.iGenPokemonTeam)({
            playerData: player,
        });
        return {
            message: `Time de Raid de ${player.name}`,
            status: 200,
            data: null,
            imageUrl: imageUrl,
        };
    }
    const stringNames = [id1, id2, id3, id4, id5, id6];
    const ids = [Number(id1), Number(id2 || 0), Number(id3 || 0), Number(id4 || 0), Number(id5 || 0), Number(id6 || 0)];
    const uniqueIds = [...new Set(ids)];
    let searchType = 'string';
    if (!isNaN(ids[0]))
        searchType = 'number';
    if (searchType === 'string') {
        const pokemonsIds = [];
        for (const name of stringNames) {
            if (!name)
                continue;
            const lowercaseName = name.toLowerCase();
            const pokemon = yield prismaClient.pokemon.findFirst({
                where: {
                    baseData: {
                        name: lowercaseName,
                    },
                    ownerId: player.id,
                },
                orderBy: {
                    level: 'desc',
                },
            });
            if (!pokemon || !pokemon.isAdult)
                throw new AppErrors_1.PokemonNotFoundError(lowercaseName);
            if (pokemon.ownerId !== player.id)
                throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(lowercaseName, player.name);
            if (!pokemonsIds.includes(pokemon.id))
                pokemonsIds.push(pokemon.id);
            if (!player.raidTeamIds.includes(pokemon.id))
                throw new AppErrors_1.PokemonIsNotInRaidTeamError(player.name, pokemon.id, lowercaseName);
        }
        for (let i = 0; i < 6; i++) {
            yield prismaClient.player.update({
                where: {
                    id: player.id,
                },
                data: {
                    ['teamPoke' + (i + 1)]: {
                        disconnect: true,
                    },
                },
            });
        }
        for (let i = 0; i < 6; i++) {
            if (pokemonsIds[i] !== 0) {
                yield prismaClient.player.update({
                    where: {
                        id: player.id,
                    },
                    data: {
                        ['teamPokeId' + (i + 1)]: pokemonsIds[i],
                    },
                });
            }
        }
        return {
            message: ``,
            status: 200,
            data: null,
            react: `👍`,
        };
    }
    for (const id of uniqueIds) {
        if (isNaN(id))
            throw new AppErrors_1.TypeMissmatchError(id.toString(), 'numero');
        if (id === 0)
            continue;
        const pokemon = yield prismaClient.pokemon.findFirst({
            where: {
                id: id,
            },
        });
        if (!pokemon)
            throw new AppErrors_1.PokemonNotFoundError(id);
        if (pokemon.ownerId !== player.id)
            throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(id, player.name);
        if (!pokemon.isAdult)
            throw new AppErrors_1.PokemonHasNotBornYetError(pokemon.id);
    }
    for (let i = 0; i < 6; i++) {
        yield prismaClient.player.update({
            where: {
                id: player.id,
            },
            data: {
                ['teamPoke' + (i + 1)]: {
                    disconnect: true,
                },
            },
        });
    }
    for (let i = 0; i < 6; i++) {
        if (uniqueIds[i] !== 0) {
            yield prismaClient.player.update({
                where: {
                    id: player.id,
                },
                data: {
                    ['teamPokeId' + (i + 1)]: uniqueIds[i],
                },
            });
        }
    }
    return {
        message: ``,
        status: 200,
        data: null,
        react: `👍`,
    };
});
exports.raidTeam = raidTeam;
//# sourceMappingURL=raidTeam.js.map