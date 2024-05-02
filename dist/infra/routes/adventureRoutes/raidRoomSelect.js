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
exports.raidRoomSelect = void 0;
const tsyringe_1 = require("tsyringe");
const iGenRaidNextRoom_1 = require("../../../server/modules/imageGen/iGenRaidNextRoom");
const AppErrors_1 = require("../../errors/AppErrors");
const raidProgress_1 = require("./raidProgress");
const raidRoomSelect = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const [, , selectType, raidIdString, roomIdString, confirm] = data.routeParams;
    if (!data.fromReact)
        throw new AppErrors_1.UnexpectedError('Rota não permitida.');
    if (!raidIdString)
        throw new AppErrors_1.MissingParameterError('Id da raid');
    if (!roomIdString)
        throw new AppErrors_1.MissingParameterError('Id da sala da raid');
    const raidId = Number(raidIdString);
    if (isNaN(raidId))
        throw new AppErrors_1.TypeMissmatchError(raidIdString, 'número');
    const roomId = Number(roomIdString);
    if (isNaN(roomId))
        throw new AppErrors_1.TypeMissmatchError(roomIdString, 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player.name);
    const raid = yield prismaClient.raid.findFirst({
        where: {
            id: raidId,
        },
        include: {
            defeatedPokemons: true,
            winnerPokemons: true,
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
                    owner: true,
                },
            },
        },
    });
    if (!raid)
        throw new AppErrors_1.RaidNotFoundError(raidIdString);
    if (raid.isFinished)
        throw new AppErrors_1.RaidAlreadyFinishedError();
    if ((_a = raid.raidRooms.find(room => room.id === roomId)) === null || _a === void 0 ? void 0 : _a.isFinished)
        throw new AppErrors_1.RoomAlreadyFinishedError(roomId);
    if (!raid.lobbyPokemons.map(poke => poke.ownerId).includes(player.id))
        throw new AppErrors_1.PlayerDoesNotBelongToRaidTeamError(player.name);
    if (player.id !== raid.creatorId && selectType === 'SELECT-ONLYCREATOR')
        throw new AppErrors_1.SendEmptyMessageError();
    const currentRoom = raid.raidRooms.find(room => room.id === roomId);
    if (!currentRoom)
        throw new AppErrors_1.RoomDoesNotExistsInRaidError(roomId, raid.name);
    if (confirm && confirm === 'CONFIRM') {
        const keyItems = yield prismaClient.item.findMany({
            where: {
                baseItem: {
                    name: {
                        in: ['potion', 'revive'],
                    },
                },
                ownerId: player.id,
            },
            include: {
                baseItem: true,
            },
        });
        const revive = keyItems.find(item => item.baseItem.name === 'revive');
        if (raid.defeatedPokemons.map(poke => poke.id).includes(player.teamPoke1.id)) {
            if (!revive || revive.amount <= 0)
                throw new AppErrors_1.PlayerDoesNotHaveReviveForPokemonInRaidError(player.name, player.teamPoke1.baseData.name);
            yield prismaClient.item.update({
                where: {
                    id: revive.id,
                },
                data: {
                    amount: {
                        decrement: 1,
                    },
                },
            });
        }
        yield prismaClient.raid.update({
            where: {
                id: raid.id,
            },
            data: {
                defeatedPokemons: {
                    disconnect: {
                        id: player.teamPoke1.id,
                    },
                },
            },
        });
        const updatedRoom = yield prismaClient.raidRoom.update({
            where: {
                id: roomId,
            },
            data: {
                lobbyPokemons: {
                    connect: {
                        id: player.teamPoke1.id,
                    },
                },
            },
            include: {
                lobbyPokemons: true,
            },
        });
        if (updatedRoom.lobbyPokemons.length === raid.requiredPlayers) {
            const client = tsyringe_1.container.resolve('ZapClientInstance1');
            yield client.sendMessage(data.groupCode, `${player.name} e ${(_b = player.teamPoke1.nickName) !== null && _b !== void 0 ? _b : player.teamPoke1.baseData.name} estão prontos para a próxima sala.\nA batalha irá iniciar.`);
            return yield (0, raidProgress_1.raidProgress)(data);
        }
        return {
            message: `${player.name} e ${(_c = player.teamPoke1.nickName) !== null && _c !== void 0 ? _c : player.teamPoke1.baseData.name} estão prontos para a próxima sala.`,
            status: 200,
        };
    }
    const imageUrl = yield (0, iGenRaidNextRoom_1.iGenRaidNextRoom)({
        enemyPokemons: currentRoom.enemyPokemons,
        raid,
    });
    return {
        message: `${raid.name.toUpperCase()} - ${raid.difficulty} - ${raid.currentRoomIndex}/${raid.raidRooms.length}
    👍 - Pronto para próxima sala`,
        status: 200,
        imageUrl,
        actions: [`pz. raid select ${raid.id} ${roomId} confirm`],
    };
});
exports.raidRoomSelect = raidRoomSelect;
//# sourceMappingURL=raidRoomSelect.js.map