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
exports.rocketInvasion = void 0;
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const iGenRocketInvasion_1 = require("../../modules/imageGen/iGenRocketInvasion");
const generateWildPokemon_1 = require("../../modules/pokemon/generate/generateWildPokemon");
const rocketInvasion = (zapClient) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = tsyringe_1.container.resolve('PrismaClient');
    const gameRooms = yield prisma.gameRoom.findMany({
        where: {
            mode: 'route',
        },
        include: {
            players: true,
        },
    });
    const basePokemons = yield prisma.basePokemon.findMany({
        where: {
            isMega: false,
        },
        include: {
            skills: true,
        },
    });
    for (const gameRoom of gameRooms) {
        const poke1 = yield (0, generateWildPokemon_1.generateWildPokemon)({
            level: Math.round(gameRoom.level * 1.2),
            savage: true,
            shinyChance: 0.25,
            isAdult: true,
            baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
        });
        const poke2 = yield (0, generateWildPokemon_1.generateWildPokemon)({
            level: Math.round(gameRoom.level * 1.2),
            savage: true,
            shinyChance: 0.25,
            isAdult: true,
            baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
        });
        const announcementText = `*A equipe rocket invadiu a ROTA ${gameRoom.id}!*`;
        const forfeitCost = Math.round(gameRoom.level * 6 * gameRoom.players.length + 2 * Math.pow(gameRoom.level, 1.3));
        const cashReward = Math.round(100 + gameRoom.level * 5 + Math.pow(gameRoom.level, 1.3));
        const lootData = [
            { itemName: 'tm-case', dropChance: 0.05 },
            { itemName: 'pokeball-box', dropChance: 0.05 },
            { itemName: 'rare-candy', dropChance: 0.05 },
            { itemName: 'prop-case', dropChance: 0.05 },
        ];
        const invasionSession = yield prisma.invasionSession.create({
            data: {
                name: 'Invasão Rocket!',
                announcementText,
                creatorId: gameRoom.id,
                gameRoomId: gameRoom.id,
                mode: 'rocket-invasion',
                requiredPlayers: 2,
                enemyPokemons: {
                    connect: [
                        {
                            id: poke1.id,
                        },
                        {
                            id: poke2.id,
                        },
                    ],
                },
                forfeitCost,
                cashReward,
                lootItemsDropRate: lootData,
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
        const imageUrl = yield (0, iGenRocketInvasion_1.iGenRocketInvasion)({
            pokemons: [poke1, poke2],
        });
        const media = whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
        const result = yield zapClient.sendMessage(gameRoom.phone, media, {
            caption: `${announcementText}

        👍 - Juntar-se a equipe de defesa (necessário: ${invasionSession.requiredPlayers} treinadores.)
`,
        });
        yield prisma.message.create({
            data: {
                msgId: result.id.id,
                type: 'rocket-invasion-announcement',
                body: '',
                actions: [`pz. invasion defend ${invasionSession.id}`],
            },
        });
    }
});
exports.rocketInvasion = rocketInvasion;
//# sourceMappingURL=rocketInvasion.js.map