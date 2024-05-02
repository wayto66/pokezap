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
exports.playerInfo1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const iGenPlayerAnalysis_1 = require("../../../../server/modules/imageGen/iGenPlayerAnalysis");
const playerInfo1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , playerId] = data.routeParams;
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    if (!playerId) {
        const player = yield prismaClient.player.findUnique({
            where: {
                phone: data.playerPhone,
            },
            include: {
                ownedItems: true,
                ownedPokemons: {
                    include: {
                        baseData: true,
                    },
                },
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
        const imageUrl = yield (0, iGenPlayerAnalysis_1.iGenPlayerAnalysis)({
            playerData: player,
        });
        return {
            message: `#${player.id} ${player.name}  `,
            status: 200,
            data: null,
            imageUrl,
        };
    }
    if (typeof Number(playerId) !== 'number')
        throw new AppErrors_1.TypeMissmatchError(playerId, 'number');
    const player = yield prismaClient.player.findUnique({
        where: { id: Number(playerId) },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerName);
    return {
        message: `Jogador encontrado, #${player.id} ${player.name}  `,
        status: 200,
        data: null,
    };
});
exports.playerInfo1 = playerInfo1;
//# sourceMappingURL=playerInfo1.js.map