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
exports.tournamentNextRound = void 0;
const AppErrors_1 = require("../../errors/AppErrors");
const logger_1 = require("../../logger");
const tournamentDuel_1 = require("./tournamentDuel");
const tournamentReward_1 = require("./tournamentReward");
const tournamentNextRound = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , tournamentIdString] = data.routeParams;
    const tournamentId = Number(tournamentIdString);
    if (isNaN(tournamentId))
        throw new AppErrors_1.UnexpectedError('tournamentIdString must be a number');
    const tournament = yield prisma.tournament.findFirst({
        where: {
            id: tournamentId,
        },
        include: {
            gymLeader: {
                include: {
                    pokemons: {
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
            activePlayers: {
                include: {
                    teamPoke1: {
                        include: {
                            baseData: {
                                include: {
                                    skills: true,
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
                        },
                    },
                    teamPoke3: {
                        include: {
                            baseData: {
                                include: {
                                    skills: true,
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
                        },
                    },
                    teamPoke5: {
                        include: {
                            baseData: {
                                include: {
                                    skills: true,
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
                        },
                    },
                },
            },
        },
    });
    if (!tournament)
        throw new AppErrors_1.UnexpectedError('no tournament found');
    const duelPairs = [];
    let players = [...tournament.activePlayers];
    let tryCount = 0;
    while (players.length > 0) {
        tryCount++;
        if (players.length === 1)
            break;
        const indexP1 = Math.floor(Math.random() * players.length);
        const p1 = players[indexP1];
        players = players.filter(p => p.id !== p1.id);
        const indexP2 = Math.floor(Math.random() * players.length);
        const p2 = players[indexP2];
        players = players.filter(p => p.id !== p2.id);
        duelPairs.push({ p1, p2 });
        if (tryCount > 100)
            throw new AppErrors_1.UnexpectedError('Erro ao sortear confrontos do torneio');
    }
    if (duelPairs.length === 0 && players.length === 1) {
        // start reward process
        logger_1.logger.info('tournament end');
        return (0, tournamentReward_1.tournamentReward)(data);
    }
    const { p1, p2 } = duelPairs[0];
    const pairIds = duelPairs
        .slice(1, 999999)
        .map(pair => [pair.p1.id.toString(), pair.p2.id.toString()])
        .flat();
    (0, tournamentDuel_1.tournamentDuel)(Object.assign(Object.assign({}, data), { routeParams: ['pz', 'tournament', 'duel', p1.id.toString(), p2.id.toString(), ...pairIds] }));
});
exports.tournamentNextRound = tournamentNextRound;
