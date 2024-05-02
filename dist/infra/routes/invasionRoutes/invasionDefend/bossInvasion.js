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
exports.bossInvasion = void 0;
const tsyringe_1 = require("tsyringe");
const bossInvasionLootMap_1 = require("../../../../server/constants/bossInvasionLootMap");
const duelNXN_1 = require("../../../../server/modules/duel/duelNXN");
const handleExperienceGain_1 = require("../../../../server/modules/pokemon/handleExperienceGain");
const AppErrors_1 = require("../../../errors/AppErrors");
const bossInvasion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , invasionSessionIdString] = data.routeParams;
    const invasionSessionId = Number(invasionSessionIdString);
    if (typeof invasionSessionId !== 'number')
        throw new AppErrors_1.TypeMissmatchError(invasionSessionIdString, 'number');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const invasionSession = yield prismaClient.invasionSession.findFirst({
        where: {
            id: invasionSessionId,
        },
        include: {
            lobbyPlayers: {
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
            },
            enemyPokemons: {
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
    if (!invasionSession || invasionSession.isFinished)
        throw new AppErrors_1.SessionIdNotFoundError(invasionSessionId);
    if (invasionSession.lobbyPlayers.length !== invasionSession.requiredPlayers)
        throw new AppErrors_1.InsufficentPlayersForInvasionError(invasionSession.lobbyPlayers.length, invasionSession.requiredPlayers);
    if (invasionSession.enemyPokemons.length !== 1)
        throw new AppErrors_1.UnexpectedError('Não há 1 pokemon inimigo.');
    const players = invasionSession.lobbyPlayers;
    for (const player of players) {
        if (!player.teamPoke1)
            throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player.name);
    }
    const allyTeam = players.map(player => player.teamPoke1);
    yield prismaClient.invasionSession.update({
        where: {
            id: invasionSession.id,
        },
        data: {
            inInLobby: false,
            isInProgress: true,
            isFinished: false,
        },
    });
    const duel = yield (0, duelNXN_1.duelNXN)({
        leftTeam: allyTeam,
        rightTeam: [invasionSession.enemyPokemons[0]],
        wildBattle: true,
    });
    if (!duel || !duel.imageUrl)
        throw new AppErrors_1.UnexpectedError('duelo');
    if (!duel.winnerTeam)
        throw new AppErrors_1.NoDuelWinnerFoundError();
    if (!duel.loserTeam)
        throw new AppErrors_1.NoDuelLoserFoundError();
    if (allyTeam.map(ally => ally.id).includes(duel.loserTeam[0].id)) {
        return yield handleInvasionLose({
            duel,
            players,
            invasionSession,
        });
    }
    const cashReward = invasionSession.cashReward || 0;
    yield prismaClient.player.updateMany({
        where: {
            OR: players.map(player => {
                return { id: player.id };
            }),
        },
        data: {
            cash: {
                increment: cashReward,
            },
        },
    });
    const expGainDisplayMessagesObject = [];
    for (const player of players) {
        const response = yield (0, handleExperienceGain_1.handleExperienceGain)({
            pokemon: player.teamPoke1,
            targetPokemon: invasionSession.enemyPokemons[0],
        });
        if (response.leveledUp) {
            expGainDisplayMessagesObject.push(`*${player.teamPoke1.baseData.name}* subiu para o nível ${player.teamPoke1.level}! \n`);
        }
    }
    yield prismaClient.invasionSession.update({
        where: {
            id: invasionSession.id,
        },
        data: {
            isInProgress: false,
            inInLobby: false,
            isFinished: true,
        },
    });
    yield prismaClient.gameRoom.update({
        where: {
            id: invasionSession.gameRoomId,
        },
        data: {
            invasor: {
                disconnect: true,
            },
        },
    });
    const boss = invasionSession.enemyPokemons[0];
    const lootData = bossInvasionLootMap_1.bossInvasionLootMap.get(boss.baseData.name);
    const shinyMultipler = boss.isShiny ? 1.5 : 1;
    const lootMessages = [];
    if (lootData) {
        for (const player of players) {
            const lootArray = [];
            for (const loot of lootData) {
                if (Math.random() * shinyMultipler < loot.dropChance) {
                    lootArray.push(loot.itemName);
                    const item = yield prismaClient.item.findFirst({
                        where: {
                            ownerId: player.id,
                            name: loot.itemName,
                        },
                    });
                    if (item) {
                        yield prismaClient.item.update({
                            where: {
                                id: item.id,
                            },
                            data: {
                                amount: {
                                    increment: 1,
                                },
                            },
                        });
                    }
                    else {
                        yield prismaClient.item.create({
                            data: {
                                ownerId: player.id,
                                name: loot.itemName,
                                amount: 1,
                            },
                        });
                    }
                }
            }
            if (Math.random() * shinyMultipler < 0.15) {
                const bonusItems = ['sun-stone', 'dusk-stone', 'dawn-stone', 'shiny-stone', 'moon-stone'];
                const itemName = bonusItems[Math.floor(Math.random() * bonusItems.length)];
                const item = yield prismaClient.item.findFirst({
                    where: {
                        ownerId: player.id,
                        name: itemName,
                    },
                });
                if (item) {
                    yield prismaClient.item.update({
                        where: {
                            id: item.id,
                        },
                        data: {
                            amount: {
                                increment: 1,
                            },
                        },
                    });
                }
                else {
                    yield prismaClient.item.create({
                        data: {
                            ownerId: player.id,
                            name: itemName,
                            amount: 1,
                        },
                    });
                }
            }
            if (lootArray.length > 1) {
                lootMessages.push(`${player.name} obteve: ${lootArray.join(', ')}.`);
                continue;
            }
            if (lootArray.length > 0)
                lootMessages.push(`${player.name} obteve: ${lootArray.flat()}.`);
        }
    }
    const afterMessage = `*${players.map(p => p.name).join(' e ')}* vencem a invasão e recebem $${cashReward} POKECOINS!.

${duel.damageDealtMessage}
${expGainDisplayMessagesObject}
${lootMessages.join(' \n')}
`;
    return {
        message: `*${players.map(p => p.name).join(' e ')}*enfrentam ${invasionSession.name}!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        afterMessage,
        afterMessageDelay: 10000,
        isAnimated: true,
    };
});
exports.bossInvasion = bossInvasion;
const handleInvasionLose = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { players, duel, invasionSession } = data;
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const cashLose = Math.round((invasionSession.cashReward || 0) * 0.33);
    yield prisma.player.updateMany({
        where: {
            OR: players.map(player => {
                return { id: player.id };
            }),
        },
        data: {
            cash: {
                decrement: cashLose,
            },
        },
    });
    yield prisma.invasionSession.update({
        where: {
            id: invasionSession.id,
        },
        data: {
            lobbyPlayers: {
                set: [],
            },
            isFinished: false,
            isInProgress: false,
            inInLobby: true,
        },
    });
    return {
        message: `*${players.map(p => p.name).join(' e ')}* enfrentam ${invasionSession.name}!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        afterMessage: `*${players.map(p => p.name).join(' e ')}* foram derrotados e perderam $${cashLose}.`,
        afterMessageDelay: 7,
        isAnimated: true,
    };
});
//# sourceMappingURL=bossInvasion.js.map