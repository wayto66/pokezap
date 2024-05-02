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
exports.battleInvasionX2 = void 0;
const tsyringe_1 = require("tsyringe");
const duelNXN_1 = require("../../../../server/modules/duel/duelNXN");
const handleExperienceGain_1 = require("../../../../server/modules/pokemon/handleExperienceGain");
const AppErrors_1 = require("../../../errors/AppErrors");
const battleInvasionX2 = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (invasionSession.enemyPokemons.length !== 2)
        throw new AppErrors_1.UnexpectedError('Não há 2 pokemon inimigos.');
    const player1 = invasionSession.lobbyPlayers[0];
    const player2 = invasionSession.lobbyPlayers[1];
    if (!player1.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player1.name);
    if (!player2.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player2.name);
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
        leftTeam: [player1.teamPoke1, player2.teamPoke1],
        rightTeam: [invasionSession.enemyPokemons[0], invasionSession.enemyPokemons[1]],
        wildBattle: true,
    });
    if (!duel || !duel.imageUrl)
        throw new AppErrors_1.UnexpectedError('duelo');
    if (!duel.winnerTeam)
        throw new AppErrors_1.NoDuelWinnerFoundError();
    if (!duel.loserTeam)
        throw new AppErrors_1.NoDuelLoserFoundError();
    if ([player1.teamPoke1.id, player2.teamPoke1.id].includes(duel.loserTeam[0].id)) {
        return yield handleInvasionLose({
            duel,
            player1,
            player2,
            invasionSession,
        });
    }
    const cashReward = invasionSession.cashReward || 0;
    yield prismaClient.player.updateMany({
        where: {
            OR: [{ id: player1.id }, { id: player2.id }],
        },
        data: {
            cash: {
                increment: cashReward,
            },
        },
    });
    const player1ExpGain = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: player1.teamPoke1,
        targetPokemon: invasionSession.enemyPokemons[0],
    });
    const player2ExpGain = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: player2.teamPoke1,
        targetPokemon: invasionSession.enemyPokemons[1],
    });
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
    const player1LevelUpMessage0 = player1ExpGain.leveledUp
        ? `*${player1.teamPoke1.baseData.name}* subiu para o nível ${player1.teamPoke1.level}!`
        : '';
    const player2LevelUpMessage0 = player2ExpGain.leveledUp
        ? `*${player2.teamPoke1.baseData.name}* subiu para o nível ${player2.teamPoke1.level}!`
        : '';
    const afterMessage = `*${player1.name}* e ${player2.name} vencem a invasão e recebem $${cashReward} POKECOINS!.
${player1LevelUpMessage0}
${player2LevelUpMessage0}
`;
    return {
        message: `*${player1.name}* e *${player2.name}* enfrentam ${invasionSession.name}!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        afterMessage,
        isAnimated: true,
    };
});
exports.battleInvasionX2 = battleInvasionX2;
const handleInvasionLose = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { player1, player2, invasionSession } = data;
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const cashLose = Math.round((invasionSession.cashReward || 0) * 1.5);
    yield prisma.player.updateMany({
        where: {
            OR: [{ id: player1.id }, { id: player2.id }],
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
        message: `*${player1.name}* e *${player2.name}* foram derrotados e perderam $${cashLose}.`,
        status: 200,
        data: null,
    };
});
//# sourceMappingURL=battleInvasionX2.js.map