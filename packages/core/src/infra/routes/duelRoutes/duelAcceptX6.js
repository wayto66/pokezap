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
exports.duelAcceptX6 = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const ContinuousDuel6x6_1 = require("../../../server/modules/duel/ContinuousDuel6x6");
const handleExperienceGain_1 = require("../../../server/modules/pokemon/handleExperienceGain");
const AppErrors_1 = require("../../errors/AppErrors");
const logger_1 = require("../../logger");
const duelAcceptX6 = (data) => __awaiter(void 0, void 0, void 0, function* () {
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
    if (player2.energy <= 0)
        throw new AppErrors_1.NoEnergyError(player2.name);
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
                    teamPoke3: {
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
                    teamPoke4: {
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
                    teamPoke5: {
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
                    teamPoke6: {
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
                    teamPoke3: {
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
                    teamPoke4: {
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
                    teamPoke5: {
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
                    teamPoke6: {
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
    if (!session.creator.teamPoke1 ||
        !session.creator.teamPoke2 ||
        !session.creator.teamPoke3 ||
        !session.creator.teamPoke4 ||
        !session.creator.teamPoke5 ||
        !session.creator.teamPoke6)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(session.creator.name);
    if (!session.invited.teamPoke1 ||
        !session.invited.teamPoke2 ||
        !session.invited.teamPoke3 ||
        !session.invited.teamPoke4 ||
        !session.invited.teamPoke5 ||
        !session.invited.teamPoke6)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(session.invited.name);
    if (session.invitedId !== player2.id)
        throw new AppErrors_1.SendEmptyMessageError();
    const staticImage = !!(fast && fast === 'FAST');
    const duel = yield (0, ContinuousDuel6x6_1.ContinuousDuel6x6)({
        leftTeam: [
            session.creator.teamPoke1,
            session.creator.teamPoke2,
            session.creator.teamPoke3,
            session.creator.teamPoke4,
            session.creator.teamPoke5,
            session.creator.teamPoke6,
        ],
        rightTeam: [
            session.invited.teamPoke1,
            session.invited.teamPoke2,
            session.invited.teamPoke3,
            session.invited.teamPoke4,
            session.invited.teamPoke5,
            session.invited.teamPoke6,
        ],
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
    const winner = yield src_1.default.player.findFirstOrThrow({
        where: {
            id: winnerId,
        },
    });
    const loser = yield src_1.default.player.findFirstOrThrow({
        where: {
            id: loserId,
        },
    });
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
    const loserPokemon0 = yield src_1.default.pokemon.findFirst({
        where: {
            id: duel.loserTeam[0].id,
        },
        include: {
            baseData: true,
        },
    });
    const loserPokemon1 = yield src_1.default.pokemon.findFirst({
        where: {
            id: duel.loserTeam[1].id,
        },
        include: {
            baseData: true,
        },
    });
    const winnerPokemon0 = yield src_1.default.pokemon.findFirst({
        where: {
            id: duel.winnerTeam[0].id,
        },
        include: {
            baseData: true,
        },
    });
    const winnerPokemon1 = yield src_1.default.pokemon.findFirst({
        where: {
            id: duel.winnerTeam[1].id,
        },
        include: {
            baseData: true,
        },
    });
    if (!loserPokemon0)
        throw new AppErrors_1.PokemonNotFoundError(duel.loserTeam[0].id);
    if (!winnerPokemon0)
        throw new AppErrors_1.PokemonNotFoundError(duel.winnerTeam[0].id);
    if (!loserPokemon1)
        throw new AppErrors_1.PokemonNotFoundError(duel.loserTeam[1].id);
    if (!winnerPokemon1)
        throw new AppErrors_1.PokemonNotFoundError(duel.winnerTeam[1].id);
    const levelDiffMessage = '';
    const handleLoseExp0 = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: loserPokemon0,
        targetPokemon: winnerPokemon0,
    });
    const handleLoseExp1 = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: loserPokemon1,
        targetPokemon: winnerPokemon1,
    });
    const handleWinExp0 = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: winnerPokemon0,
        targetPokemon: loserPokemon0,
    });
    const handleWinExp1 = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: winnerPokemon1,
        targetPokemon: loserPokemon1,
    });
    const winnerLevelUpMessage0 = (handleWinExp0 === null || handleWinExp0 === void 0 ? void 0 : handleWinExp0.leveledUp)
        ? `*${winnerPokemon0.baseData.name}* subiu para o nível ${handleWinExp0.pokemon.level}!`
        : '';
    const loserLevelUpMessage0 = (handleLoseExp0 === null || handleLoseExp0 === void 0 ? void 0 : handleLoseExp0.leveledUp)
        ? `*${loserPokemon0.baseData.name}* subiu para o nível ${handleLoseExp0.pokemon.level}!`
        : '';
    const winnerLevelUpMessage1 = (handleWinExp1 === null || handleWinExp1 === void 0 ? void 0 : handleWinExp1.leveledUp)
        ? `*${winnerPokemon1.baseData.name}* subiu para o nível ${handleWinExp1.pokemon.level}!`
        : '';
    const loserLevelUpMessage1 = (handleLoseExp1 === null || handleLoseExp1 === void 0 ? void 0 : handleLoseExp1.leveledUp)
        ? `*${loserPokemon1.baseData.name}* subiu para o nível ${handleLoseExp1.pokemon.level}!`
        : '';
    const afterMessage = `*${updatedWinnerPlayer.name}* vence o duelo e recebe +${eloGain} pontos de ranking e +${cashGain} POKECOINS.
*${updatedLoserPlayer.name}* perdeu ${eloLose} pontos de ranking.

*${duel.winnerTeam[0].name}* causou ${duel.winnerTeam[0].totalDamageDealt.toFixed(0)} de dano.
*${duel.winnerTeam[1].name}* causou ${duel.winnerTeam[1].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[0].name}* causou ${duel.loserTeam[0].totalDamageDealt.toFixed(0)} de dano.
*${duel.loserTeam[1].name}* causou ${duel.loserTeam[1].totalDamageDealt.toFixed(0)} de dano.

${[...duel.winnerTeam, ...duel.loserTeam]
        .map(p => {
        if (p.totalHealing > 0)
            return `*${p.name}* curou ${p.totalHealing.toFixed(0)}.`;
        return '';
    })
        .filter((m) => m.length > 0)
        .join('\n')}

${[...duel.winnerTeam, ...duel.loserTeam]
        .map(p => {
        const messages = [];
        for (const key in p.buffData) {
            if (p.buffData[key] > 0) {
                messages.push(`*${p.name}* aumentou a ${key} de seu time em ${p.buffData[key]}.`);
            }
        }
        return messages.join('\n');
    })
        .filter((m) => m.length > 5)
        .join('\n')}

${levelDiffMessage}
${winnerLevelUpMessage0}
${winnerLevelUpMessage1}
${loserLevelUpMessage0}
${loserLevelUpMessage1}`;
    return {
        message: `${session.creator.name} enfrenta ${session.invited.name} em um duelo x6!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        afterMessage,
        isAnimated: !staticImage,
    };
});
exports.duelAcceptX6 = duelAcceptX6;
