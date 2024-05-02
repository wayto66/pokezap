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
exports.pokeBossInvasion = void 0;
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const bossInvasionLootMap_1 = require("../../../server/constants/bossInvasionLootMap");
const bossPokemonNames_1 = require("../../../server/constants/bossPokemonNames");
const iGenPokeBossInvasion_1 = require("../../../server/modules/imageGen/iGenPokeBossInvasion");
const generateBossPokemon_1 = require("../../../server/modules/pokemon/generate/generateBossPokemon");
const pokeBossInvasion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const bossesBaseData = yield prisma.basePokemon.findMany({
        where: {
            name: {
                in: bossPokemonNames_1.bossPokemonNames,
            },
        },
    });
    const gameRooms = yield prisma.gameRoom.findMany({
        where: {
            mode: 'route',
        },
        include: {
            players: true,
        },
    });
    for (const gameRoom of gameRooms) {
        if (gameRoom.invasorId || gameRoom.level < 14)
            continue;
        const pokeBoss = yield (0, generateBossPokemon_1.generateBossPokemon)({
            baseData: bossesBaseData[Math.floor(Math.random() * bossesBaseData.length)],
            level: Math.round((gameRoom.level * 2.2) / 1.25),
            savage: true,
            shinyChance: 0.35,
        });
        const displayName = pokeBoss.isShiny
            ? `SHINY ${pokeBoss.baseData.name.toUpperCase()}`
            : pokeBoss.baseData.name.toUpperCase();
        const announcementText = `Um *${displayName}* nível ${pokeBoss.level} invadiu a ROTA ${gameRoom.id}!`;
        const forfeitCost = Math.round(gameRoom.level * 6 * gameRoom.players.length + 2 * Math.pow(gameRoom.level, 1.3));
        const cashReward = Math.round(200 + gameRoom.level * 10 + 2 * Math.pow(gameRoom.level, 1.6));
        const lootItemsDropRate = bossInvasionLootMap_1.bossInvasionLootMap.get(pokeBoss.baseData.name);
        const invasionSession = yield prisma.invasionSession.create({
            data: {
                name: 'Invasão: ' + displayName,
                announcementText,
                creatorId: gameRoom.id,
                gameRoomId: gameRoom.id,
                mode: 'boss-invasion',
                requiredPlayers: Math.min(3, Math.ceil(gameRoom.players.length / 2)),
                enemyPokemons: {
                    connect: {
                        id: pokeBoss.id,
                    },
                },
                forfeitCost,
                cashReward,
                lootItemsDropRate,
            },
        });
        yield prisma.gameRoom.update({
            where: {
                id: gameRoom.id,
            },
            data: {
                invasorId: invasionSession.id,
            },
        });
        const imageUrl = yield (0, iGenPokeBossInvasion_1.iGenPokeBossInvasion)({
            invasionSession,
            pokeBoss,
        });
        const media = whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
        const result = yield data.zapClient.sendMessage(gameRoom.phone, media, {
            caption: `${announcementText}

        👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
`,
        });
        yield prisma.message.create({
            data: {
                msgId: result.id.id,
                type: 'poke-boss-invasion-announcement',
                body: '',
                actions: [`pz. invasion defend ${invasionSession.id}`],
            },
        });
    }
});
exports.pokeBossInvasion = pokeBossInvasion;
//# sourceMappingURL=pokeBossInvasion.js.map