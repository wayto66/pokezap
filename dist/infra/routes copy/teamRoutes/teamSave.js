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
exports.teamSave = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const teamSave = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , teamNameUppercase] = data.routeParams;
    if (!teamNameUppercase)
        throw new AppErrors_1.MissingParameterError('Nome do time');
    const teamName = teamNameUppercase.toLowerCase();
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
            teamPoke2: {
                include: {
                    baseData: true,
                },
            },
            teamPoke3: {
                include: {
                    baseData: true,
                },
            },
            teamPoke4: {
                include: {
                    baseData: true,
                },
            },
            teamPoke5: {
                include: {
                    baseData: true,
                },
            },
            teamPoke6: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    const currentTeamIds = [
        player.teamPokeId1,
        player.teamPokeId2,
        player.teamPokeId3,
        player.teamPokeId4,
        player.teamPokeId5,
        player.teamPokeId6,
    ].filter(value => value !== null);
    const team = yield prismaClient.pokeTeam.upsert({
        where: {
            name_ownerId: {
                name: teamName,
                ownerId: player.id,
            },
        },
        update: {
            pokeIds: currentTeamIds,
            slot1Id: currentTeamIds[0],
            slot2Id: currentTeamIds[1],
            slot3Id: currentTeamIds[2],
            slot4Id: currentTeamIds[3],
            slot5Id: currentTeamIds[4],
            slot6Id: currentTeamIds[5],
        },
        create: {
            ownerId: player.id,
            name: teamName,
            slot1Id: currentTeamIds[0],
            slot2Id: currentTeamIds[1],
            slot3Id: currentTeamIds[2],
            slot4Id: currentTeamIds[3],
            slot5Id: currentTeamIds[4],
            slot6Id: currentTeamIds[5],
        },
    });
    return {
        message: '',
        react: '👌',
        status: 200,
    };
});
exports.teamSave = teamSave;
//# sourceMappingURL=teamSave.js.map