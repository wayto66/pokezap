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
exports.register4 = void 0;
const tsyringe_1 = require("tsyringe");
const spawnTutorialPokemon_1 = require("../../../../server/modules/pokemon/spawnTutorialPokemon");
const AppErrors_1 = require("../../../errors/AppErrors");
const register4 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    const gameRoom = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player || !gameRoom)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const { pokemon, imageUrl } = yield (0, spawnTutorialPokemon_1.spawnTutorialPokemon)({ gameRoom, player });
    return {
        message: `Você encontrou um ${pokemon.baseData.name} selvagem!

    👍 - Batalhar
    `,
        status: 200,
        imageUrl: imageUrl,
        data: null,
        actions: [`pz. start 5 ${pokemon.id}`],
    };
});
exports.register4 = register4;
//# sourceMappingURL=register4.js.map