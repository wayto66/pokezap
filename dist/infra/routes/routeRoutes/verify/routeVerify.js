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
exports.routeVerify = void 0;
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const iGenPokeBossInvasion_1 = require("../../../../server/modules/imageGen/iGenPokeBossInvasion");
const iGenRocketInvasion_1 = require("../../../../server/modules/imageGen/iGenRocketInvasion");
const AppErrors_1 = require("../../../errors/AppErrors");
const routeVerify = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            phone: data.groupCode,
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(data.playerName, data.groupCode);
    if (!route.invasorId)
        return {
            message: `Tudo tranquilo na rota ${route.id}.`,
            status: 200,
            data: null,
        };
    const invasionSession = yield prismaClient.invasionSession.findFirst({
        where: {
            id: route.invasorId,
        },
        include: {
            enemyPokemons: {
                include: {
                    baseData: true,
                },
            },
        },
    });
    if (!invasionSession)
        throw new AppErrors_1.InvasionNotFoundError(route.invasorId);
    if (!invasionSession.enemyPokemons)
        throw new AppErrors_1.UnexpectedError('no enemies on route invasion');
    if (invasionSession.isFinished)
        throw new AppErrors_1.UnexpectedError('finished invasion still registered on route.');
    if (invasionSession.mode === 'boss-invasion') {
        const imageUrl = yield (0, iGenPokeBossInvasion_1.iGenPokeBossInvasion)({
            invasionSession,
            pokeBoss: invasionSession.enemyPokemons[0],
        });
        whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
        return {
            message: `${invasionSession.announcementText}
  
      👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
  `,
            status: 200,
            data: null,
            imageUrl,
            actions: [`pz. invasion defend ${invasionSession.id}`],
        };
    }
    if (invasionSession.mode === 'rocket-invasion') {
        const imageUrl = yield (0, iGenRocketInvasion_1.iGenRocketInvasion)({
            pokemons: invasionSession.enemyPokemons,
        });
        whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
        return {
            message: `${invasionSession.announcementText}
  
      👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
  `,
            status: 200,
            data: null,
            imageUrl,
            actions: [`pz. invasion defend ${invasionSession.id}`],
        };
    }
    throw new AppErrors_1.UnexpectedError('unsupported invasion mode.');
});
exports.routeVerify = routeVerify;
//# sourceMappingURL=routeVerify.js.map