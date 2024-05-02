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
exports.duelX6Route = void 0;
const tsyringe_1 = require("tsyringe");
const iGenDuelX2_1 = require("../../../server/modules/imageGen/iGenDuelX2");
const AppErrors_1 = require("../../errors/AppErrors");
const duelX6Route = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , challengedPlayerIdString] = data.routeParams;
    const challengedPlayerId = Number(challengedPlayerIdString);
    if (typeof challengedPlayerId !== 'number')
        throw new AppErrors_1.TypeMissmatchError(challengedPlayerIdString, 'number');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player1 = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
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
        },
    });
    if (!player1)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player1.teamPoke1 || !player1.teamPoke2)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player1.name);
    if (player1.energy <= 0)
        throw new AppErrors_1.NoEnergyError(player1.name);
    if (player1.id === challengedPlayerId)
        throw new AppErrors_1.CantDuelItselfError();
    const player2 = yield prismaClient.player.findFirst({
        where: {
            id: challengedPlayerId,
        },
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
        },
    });
    if (!player2)
        throw new AppErrors_1.PlayerNotFoundError(challengedPlayerIdString);
    if (!player2.teamPoke1 || !player2.teamPoke2)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player2.name);
    const newSession = yield prismaClient.session.create({
        data: {
            mode: 'duel-x2',
            creatorId: player1.id,
            invitedId: player2.id,
        },
    });
    const imageUrl = yield (0, iGenDuelX2_1.iGenDuelX2)({
        player1: player1,
        player2: player2,
    });
    return {
        message: `${player1.name} desafia ${player2.name} para um duelo X6!
    👍 - Aceitar`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [`pz. duel acceptx6 ${newSession.id}`],
    };
});
exports.duelX6Route = duelX6Route;
//# sourceMappingURL=duelX6Route.js.map