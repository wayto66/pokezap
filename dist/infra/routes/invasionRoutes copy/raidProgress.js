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
exports.raidProgress = void 0;
const tsyringe_1 = require("tsyringe");
const duelNXN_1 = require("../../../server/modules/duel/duelNXN");
const AppErrors_1 = require("../../errors/AppErrors");
const raidProgress = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , raidIdString] = data.routeParams;
    if (!data.fromReact)
        throw new AppErrors_1.UnexpectedError('Rota não permitida.');
    if (!raidIdString)
        throw new AppErrors_1.MissingParametersBattleRouteError();
    const raidId = Number(raidIdString);
    if (isNaN(raidId))
        throw new AppErrors_1.TypeMissmatchError(raidIdString, 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const raid = yield prismaClient.raid.findFirst({
        where: {
            id: raidId,
        },
        include: {
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
                },
            },
        },
    });
    if (!raid)
        throw new AppErrors_1.InvasionNotFoundError(raidIdString);
    if (raid.isFinished)
        throw new AppErrors_1.InvasionAlreadyFinishedError();
    const currentTeamData = raid.currentRoomIndex === 0 ? raid.lobbyPokemons : raid.raidRooms[raid.currentRoomIndex - 1].winnerPokemons;
    yield (0, duelNXN_1.duelNXN)({
        playerTeam: currentTeamData,
        enemyTeam: raid.raidRooms[raid.currentRoomIndex].enemyPokemons,
    });
    // TODO: RAID
    // if (updatedRaid.lobbyPlayers.length === raid.requiredPlayers) {
    //   const zapClient = container.resolve<Client>('ZapClientInstance1')
    //   await zapClient.sendMessage(
    //     data.groupCode,
    //     `*${player.name}* e *${player.teamPoke1.baseData.name}* entraram para a equipe de raid!
    //     A aventura vai iniciar!`
    //   )
    //   if (updatedInvasionSession.mode === 'boss-invasion')
    //     return await bossInvasion({ ...data, routeParams: ['', '', '', updatedInvasionSession.id.toString()] })
    //   return await battleInvasionX2({ ...data, routeParams: ['', '', '', updatedInvasionSession.id.toString()] })
    // }
    return {
        // message: `*${player.name}* e *${playerPokemon.baseData.name}* entraram para a equipe de defesa!`,
        message: `TO BE DEFINED`,
        status: 200,
        data: null,
    };
});
exports.raidProgress = raidProgress;
//# sourceMappingURL=raidProgress.js.map