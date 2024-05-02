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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.duelAccept = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const duelNXN_1 = require("../../../server/modules/duel/duelNXN");
const handleExperienceGain_1 = require("../../../server/modules/pokemon/handleExperienceGain");
const logger_1 = require("../../logger");
const duelAccept = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , sessionIdString, fast] = data.routeParams;
    const sessionId = Number(sessionIdString);
    if (typeof sessionId !== 'number')
        throw new AppErrors_1.TypeMissmatchError(sessionIdString, 'number');
    const player2 = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player2)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const session = yield src_1.default.session.findFirst({
        where: {
            id: sessionId,
        },
        include: {
            creator: {
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
                    teamPoke2: {
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
            invited: {
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
                    teamPoke2: {
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
        },
    });
    if (!session || session.isFinished)
        throw new AppErrors_1.SessionIdNotFoundError(sessionId);
    if (!session.creator.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name);
    if (!session.invited.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name);
    if (session.invitedId !== player2.id)
        throw new AppErrors_1.SendEmptyMessageError();
    if (session.creator.energy <= 0)
        throw new AppErrors_1.NoEnergyError(session.creator.name);
    if (session.invited.energy <= 0)
        throw new AppErrors_1.NoEnergyError(session.invited.name);
    const staticImage = !!(fast && fast === 'FAST');
    const duel = yield (0, duelNXN_1.duelNXN)({
        leftTeam: [session.creator.teamPoke1],
        rightTeam: [session.invited.teamPoke1],
        staticImage,
    });
    if (!duel || !duel.imageUrl)
        throw new AppErrors_1.UnexpectedError('duelo');
    if (!duel.winnerTeam)
        throw new AppErrors_1.NoDuelWinnerFoundError();
    if (!duel.loserTeam)
        throw new AppErrors_1.NoDuelLoserFoundError();
    const winnerId = duel.winnerTeam[0].ownerId;
    const loserId = duel.loserTeam[0].ownerId;
    if (!winnerId)
        throw new AppErrors_1.UnexpectedError('duelo');
    if (!loserId)
        throw new AppErrors_1.UnexpectedError('duelo');
    if (isNaN(winnerId))
        throw new AppErrors_1.TypeMissmatchError(winnerId.toString(), 'number');
    if (isNaN(loserId))
        throw new AppErrors_1.TypeMissmatchError(loserId.toString(), 'number');
    const players = new Map([
        [session.creator.id, session.creator],
        [session.invited.id, session.invited],
    ]);
    const winner = players.get(winnerId);
    const loser = players.get(loserId);
    if (!winner)
        throw new AppErrors_1.PlayerNotFoundError(winnerId.toString());
    if (!loser)
        throw new AppErrors_1.PlayerNotFoundError(loserId.toString());
    const higherElo = Math.max(loser.elo, winner.elo);
    const lowerElo = Math.min(loser.elo, winner.elo);
    const getRewardsData = () => {
        const highEloGain = Math.max(10, Number((25 + (higherElo / 1200 - lowerElo / 1200) * 50).toFixed(2)));
        const lowEloGain = Math.max(10, Number((25 + (lowerElo / 1200 - higherElo / 1200) * 50).toFixed(2)));
        const highCashGain = Math.max(10, Number((100 + (higherElo / 1200 - lowerElo / 1200) * 70).toFixed(2)));
        const lowCashGain = Math.max(10, Number((100 + (lowerElo / 1200 - higherElo / 1200) * 70).toFixed(2)));
        const loseRatio = -1;
        return {
            highEloGain,
            lowEloGain,
            highCashGain,
            lowCashGain,
            loseRatio,
        };
    };
    const rewardsData = getRewardsData();
    const eloLose = loser.elo === lowerElo ? rewardsData.lowEloGain : rewardsData.highEloGain;
    const eloGain = winner.elo === lowerElo ? rewardsData.highEloGain : rewardsData.lowEloGain;
    const cashGain = winner.elo === lowerElo ? rewardsData.highCashGain : rewardsData.lowCashGain;
    const updatedWinnerPlayer = yield src_1.default.player
        .update({
        where: {
            id: winner.id,
        },
        data: {
            energy: {
                decrement: 1,
            },
            elo: {
                increment: Math.round(eloGain),
            },
            cash: {
                increment: Math.round(cashGain),
            },
        },
    })
        .catch(e => logger_1.logger.error(e));
    const updatedLoserPlayer = yield src_1.default.player
        .update({
        where: {
            id: loser.id,
        },
        data: {
            energy: {
                decrement: 1,
            },
            elo: {
                decrement: Math.round(eloLose),
            },
        },
    })
        .catch(e => logger_1.logger.error(e));
    if (!updatedLoserPlayer)
        throw new AppErrors_1.CouldNotUpdatePlayerError('id', loser.id);
    if (!updatedWinnerPlayer)
        throw new AppErrors_1.CouldNotUpdatePlayerError('id', winner.id);
    if (!winner.teamPoke1)
        throw new AppErrors_1.UnexpectedError('NOTEAMPOKE1');
    if (!loser.teamPoke1)
        throw new AppErrors_1.UnexpectedError('NOTEAMPOKE1');
    const pokemons = new Map([
        [winner.teamPoke1.id, winner.teamPoke1],
        [loser.teamPoke1.id, loser.teamPoke1],
    ]);
    const loserPokemon = pokemons.get(duel.loserTeam[0].id);
    const winnerPokemon = pokemons.get(duel.winnerTeam[0].id);
    if (!loserPokemon)
        throw new AppErrors_1.PokemonNotFoundError(duel.loserTeam[0].id);
    if (!winnerPokemon)
        throw new AppErrors_1.PokemonNotFoundError(duel.winnerTeam[0].id);
    const handleLoseExp = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: loserPokemon,
        targetPokemon: winnerPokemon,
    });
    const handleWinExp = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: winnerPokemon,
        targetPokemon: loserPokemon,
    });
    const winnerLevelUpMessage = handleWinExp.leveledUp
        ? `*${winnerPokemon.baseData.name}* subiu para o nível ${handleWinExp.pokemon.level}!`
        : '';
    const loserLevelUpMessage = handleLoseExp.leveledUp
        ? `*${loserPokemon.baseData.name}* subiu para o nível ${handleLoseExp.pokemon.level}!`
        : '';
    const afterMessage = `*${updatedWinnerPlayer.name}* vence o duelo e recebe +${eloGain} pontos de ranking e +${cashGain} POKECOINS.
*${updatedLoserPlayer.name}* perdeu ${eloLose} pontos de ranking.
${winnerLevelUpMessage}
${loserLevelUpMessage}`;
    return {
        message: `${session.creator.name} e seu ${session.creator.teamPoke1.baseData.name} enfrenta o ${session.invited.teamPoke1.baseData.name} de ${session.invited.name}.`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        afterMessage,
        isAnimated: !staticImage,
    };
});
exports.duelAccept = duelAccept;
