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
exports.raidProgress = void 0;
const tsyringe_1 = require("tsyringe");
const raidsDataMap_1 = require("../../../server/constants/raidsDataMap");
const duelNXN_1 = require("../../../server/modules/duel/duelNXN");
const handleExperienceGain_1 = require("../../../server/modules/pokemon/handleExperienceGain");
const AppErrors_1 = require("../../errors/AppErrors");
const logger_1 = require("../../logger");
const raidCreate_1 = require("./raidCreate");
const raidProgress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const [, , , raidIdString, roomIdString] = data.routeParams;
    if (!data.fromReact)
        throw new AppErrors_1.UnexpectedError('Rota não permitida.');
    if (!raidIdString)
        throw new AppErrors_1.MissingParameterError('raid id');
    if (!roomIdString)
        throw new AppErrors_1.MissingParameterError('room id');
    const raidId = Number(raidIdString);
    if (isNaN(raidId))
        throw new AppErrors_1.TypeMissmatchError(raidIdString, 'número');
    const roomId = Number(roomIdString);
    if (isNaN(roomId))
        throw new AppErrors_1.TypeMissmatchError(roomIdString, 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const raid = yield prismaClient.raid.findFirst({
        where: {
            id: raidId,
        },
        include: {
            raidRooms: {
                include: {
                    defeatedPokemons: true,
                    winnerPokemons: {
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
                    enemyPokemons: {
                        include: {
                            baseData: {
                                include: {
                                    skills: true,
                                },
                            },
                        },
                    },
                },
            },
            lobbyPokemons: {
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
    if (!raid)
        throw new AppErrors_1.InvasionNotFoundError(raidIdString);
    if (raid.isFinished)
        throw new AppErrors_1.InvasionAlreadyFinishedError();
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const currentRoom = yield prismaClient.raidRoom.findFirst({
        where: {
            id: roomId,
        },
        include: {
            lobbyPokemons: {
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
                    owner: true,
                },
            },
            enemyPokemons: {
                include: {
                    baseData: {
                        include: {
                            skills: true,
                        },
                    },
                },
            },
        },
    });
    if (!currentRoom)
        throw new AppErrors_1.RoomDoesNotExistsInRaidError(roomId, raid.name);
    if (currentRoom.lobbyPokemons.length !== raid.requiredPlayers)
        throw new AppErrors_1.UnexpectedError(`Lobby pokemons not equal to required players in room ${currentRoom.id}`);
    if (currentRoom.enemyPokemons.length === 0)
        throw new AppErrors_1.UnexpectedError(`No enemy pokemons in room ${currentRoom.id}`);
    const currentRoomIndex = raid.raidRooms.findIndex(r => r.id === currentRoom.id);
    const duel = yield (0, duelNXN_1.duelNXN)({
        leftTeam: currentRoom.lobbyPokemons,
        rightTeam: currentRoom.enemyPokemons,
        returnOnlyPlayerPokemonDefeatedIds: true,
        backgroundTypeName: raid.raidRooms[raid.raidRooms.length - 1].enemyPokemons[0].baseData.type1Name,
    });
    if (!duel)
        throw new AppErrors_1.UnexpectedError('no duel data in room: ' + currentRoom.id);
    console.log({ duel });
    // handle lose scenario
    if (duel.loserTeam.map(p => p.ownerId).includes(currentRoom.lobbyPokemons[0].ownerId)) {
        yield prismaClient.raid.update({
            where: {
                id: raid.id,
            },
            data: {
                isFinished: true,
                isInProgress: false,
                inInLobby: false,
            },
        });
        yield prismaClient.$transaction(raid.lobbyPokemons.map(poke => {
            var _a;
            return prismaClient.player.update({
                where: {
                    id: (_a = poke.ownerId) !== null && _a !== void 0 ? _a : 0,
                },
                data: {
                    isInRaid: false,
                    cash: {
                        decrement: Math.round(raid.cashReward * 0.2),
                    },
                },
            });
        }));
        if (currentRoom.isFinalRoom) {
            // TODO: give player rewards
            return {
                message: `A equipe de raid enfrenta ${currentRoom.enemyPokemons[0].baseData.name.toUpperCase()}!`,
                status: 200,
                data: null,
                imageUrl: duel.imageUrl,
                isAnimated: true,
                afterMessage: `${currentRoom.enemyPokemons[0].baseData.name.toUpperCase()} derrotou a equipe de raid.
        
        ${duel.damageDealtMessage}`,
                afterMessageDelay: 10000,
            };
        }
        return {
            message: `A equipe de raid enfrenta a sala ${currentRoomIndex} de ${raid.name}!`,
            status: 200,
            data: null,
            imageUrl: duel.imageUrl,
            isAnimated: true,
            afterMessage: `${duel.damageDealtMessage}
      
      A equipe de raid foi derrotada.`,
            afterMessageDelay: 10000,
        };
    }
    // handle raid end win scenario
    if (currentRoom.isFinalRoom) {
        const raidLootData = raidsDataMap_1.raidsDataMap.get(currentRoom.enemyPokemons[0].baseData.name);
        const raidDifficultyData = raidCreate_1.raidDifficultyDataMap.get(raid.difficulty);
        const lootMessages = [];
        if (!raidLootData)
            throw new AppErrors_1.UnexpectedError(' no raidlootdata found for : ' + currentRoom.enemyPokemons[0].baseData.name);
        if (!raidDifficultyData)
            throw new AppErrors_1.UnexpectedError(' no raidDifficultyData found for : ' + raid.difficulty);
        const prismaPromises = [];
        for (const player of currentRoom.lobbyPokemons.map(p => p.owner)) {
            if (!player) {
                logger_1.logger.error('No player found');
                continue;
            }
            for (const loot of raidLootData.loot) {
                if (Math.random() < loot.dropRate * raidDifficultyData.dropRate) {
                    const amount = Math.floor(Math.random() * loot.amount[1] + loot.amount[0]);
                    lootMessages.push(`${player.name} obteve ${amount} *${loot.name}*`);
                    prismaPromises.push(prismaClient.item.upsert({
                        create: {
                            name: loot.name,
                            amount,
                            ownerId: player.id,
                        },
                        update: {
                            amount: {
                                increment: amount,
                            },
                        },
                        where: {
                            ownerId_name: {
                                ownerId: player.id,
                                name: loot.name,
                            },
                        },
                    }));
                }
            }
        }
        yield prismaClient.$transaction(prismaPromises);
        const levelupMessages = [];
        for (const pokemon of currentRoom.lobbyPokemons) {
            const response = yield (0, handleExperienceGain_1.handleExperienceGain)({
                pokemon,
                targetPokemon: currentRoom.enemyPokemons[0],
            });
            if (response.leveledUp)
                levelupMessages.push(`${(_a = pokemon.nickName) !== null && _a !== void 0 ? _a : pokemon.baseData.name} avançou para o nível ${pokemon.level + 1}!`);
        }
        yield prismaClient.player.updateMany({
            where: {
                id: {
                    in: raid.lobbyPokemons.map(p => p.ownerId || 0),
                },
            },
            data: {
                cash: {
                    increment: raidDifficultyData.cashReward,
                },
                isInRaid: false,
            },
        });
        return {
            message: `A equipe de raid enfrenta ${currentRoom.enemyPokemons[0].baseData.name.toUpperCase()}!
     `,
            status: 200,
            data: null,
            imageUrl: duel.imageUrl,
            isAnimated: true,
            afterMessage: `${raid.name} foi derrotado! A equipe de raid venceu!
      ${duel.damageDealtMessage}
           
      ${levelupMessages.join('\n')}
      ${lootMessages.join('\n')}`,
            afterMessageDelay: 15000,
        };
    }
    console.log('h1');
    const currentRoomIndexInArray = raid.raidRooms.findIndex(r => r.id === roomId);
    const nextRoom = raid.raidRooms[currentRoomIndexInArray + 1];
    if (!nextRoom)
        throw new AppErrors_1.UnexpectedError('no next room for currentRoomIndexInArray: ' + currentRoomIndexInArray);
    yield prismaClient.raid.update({
        where: {
            id: raid.id,
        },
        data: {
            defeatedPokemons: {
                connect: (_b = duel.defeatedPokemonsIds) === null || _b === void 0 ? void 0 : _b.map(id => {
                    return { id: id };
                }),
            },
            currentRoomIndex: nextRoom.id,
        },
    });
    const raidCreator = yield prismaClient.player.findUnique({
        where: {
            id: raid.creatorId,
        },
    });
    if (!raidCreator)
        throw new AppErrors_1.PlayerNotFoundError(raid.creatorId.toString());
    return {
        message: `A equipe de raid enfrenta a sala ${currentRoomIndex} de ${raid.name}!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        isAnimated: true,
        afterMessage: `${duel.damageDealtMessage}

    *${raidCreator.name}* deve confirmar o avanço na raid.
    👍 - Prosseguir raid`,
        afterMessageDelay: 10000,
        afterMessageActions: [`pz. raid select-onlycreator ${raid.id} ${nextRoom.id} `],
    };
});
exports.raidProgress = raidProgress;
//# sourceMappingURL=raidProgress.js.map