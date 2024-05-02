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
exports.duelX1Generate = void 0;
const iGenDuelX2_1 = require("../../../../../image-generator/src/iGenDuelX2");
const AppErrors_1 = require("../../errors/AppErrors");
const include = {
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
};
const duelX1Generate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , player1IdString, player2IdString] = data.routeParams;
    const player1Id = Number(player1IdString);
    const player2Id = Number(player2IdString);
    if (typeof player1Id !== 'number')
        throw new AppErrors_1.TypeMissmatchError(player1IdString, 'NÚMERO');
    if (typeof player2Id !== 'number')
        throw new AppErrors_1.TypeMissmatchError(player2IdString, 'NÚMERO');
    const player1 = yield prisma.player.findUnique({
        where: {
            id: player1Id,
        },
        include,
    });
    if (!player1)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player1.teamPoke1 ||
        !player1.teamPoke2 ||
        !player1.teamPoke3 ||
        !player1.teamPoke4 ||
        !player1.teamPoke5 ||
        !player1.teamPoke6)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player1.name);
    if (player1.id === player2Id)
        throw new AppErrors_1.CantDuelItselfError();
    const player2 = yield prisma.player.findUnique({
        where: {
            id: player2Id,
        },
        include,
    });
    if (!player2)
        throw new AppErrors_1.PlayerNotFoundError(player2IdString);
    if (!player1.teamPoke1 ||
        !player1.teamPoke2 ||
        !player1.teamPoke3 ||
        !player1.teamPoke4 ||
        !player1.teamPoke5 ||
        !player1.teamPoke6)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player2.name);
    const newSession = yield prisma.session.create({
        data: {
            mode: 'duel-x6',
            creatorId: player1.id,
            invitedId: player2.id,
        },
    });
    const imageUrl = yield (0, iGenDuelX2_1.iGenDuelX2)({
        player1: player1,
        player2: player2,
    });
    return {
        message: `Um novo duelo foi gerado!
    
    *#${player1.id} ${player1.name}* contra *#${player2.id} ${player2.name}*!

    👍 - Aceitar`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [
            `pz. duel generated-accept ${newSession.id}`,
            `pz. duel generated-accept ${newSession.id}`,
            `pz. duel generated-accept ${newSession.id}`,
        ],
    };
});
exports.duelX1Generate = duelX1Generate;
