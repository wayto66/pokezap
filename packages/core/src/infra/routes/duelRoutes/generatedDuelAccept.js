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
exports.generatedDuelAccept = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const ContinuousDuel6x6_1 = require("../../../server/modules/duel/ContinuousDuel6x6");
const AppErrors_1 = require("../../errors/AppErrors");
const include = {
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
};
const generatedDuelAccept = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , sessionIdString, fast] = data.routeParams;
    const sessionId = Number(sessionIdString);
    if (typeof sessionId !== 'number')
        throw new AppErrors_1.TypeMissmatchError(sessionIdString, 'number');
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const session = yield src_1.default.session.findFirst({
        where: {
            id: sessionId,
        },
        include: {
            creator: {
                include,
            },
            invited: {
                include,
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
    if (!session.creatorAccepted && !session.invitedAccepted) {
        yield src_1.default.session.update({
            where: {
                id: session.id,
            },
            data: {
                [player.id === session.creatorId ? 'creatorAccepted' : 'invitedAccepted']: true,
            },
        });
        return {
            message: `*${player.name}* está pronto para o duelo!`,
            status: 200,
        };
    }
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
    if (!winner.teamPoke1)
        throw new AppErrors_1.UnexpectedError('NOTEAMPOKE1');
    if (!loser.teamPoke1)
        throw new AppErrors_1.UnexpectedError('NOTEAMPOKE1');
    const afterMessage = `*${winner.name}* vence o duelo!

${duel.damageDealtMessage}`;
    return {
        message: `*${session.creator.name}* enfrenta *${session.invited.name}*!`,
        status: 200,
        data: null,
        imageUrl: duel.imageUrl,
        afterMessage,
        isAnimated: !staticImage,
    };
});
exports.generatedDuelAccept = generatedDuelAccept;
