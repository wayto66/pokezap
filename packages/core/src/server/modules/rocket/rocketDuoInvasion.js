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
exports.rocketDuoInvasion = void 0;
const whatsapp_web_js_1 = require("whatsapp-web.js");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const iGenWildPokemon_1 = require("../imageGen/iGenWildPokemon");
const generateWildPokemon_1 = require("../pokemon/generate/generateWildPokemon");
const rocketDuoInvasion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = container.resolve('PrismaClient');
    const zap = container.resolve('ZapClientInstance1');
    const { gameRoom } = data;
    const baseExperienceTreshold = Math.min(Math.floor(64 + (gameRoom.level + 5 / 100) * 276), 280);
    const basePokemons = yield prisma.basePokemon.findMany({
        where: {
            BaseExperience: {
                lte: baseExperienceTreshold,
            },
        },
        include: {
            skills: true,
        },
    });
    const rocketPokemon1 = yield (0, generateWildPokemon_1.generateWildPokemon)({
        baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
        isAdult: true,
        level: gameRoom.level + Math.floor(Math.random() * 5),
        savage: false,
        shinyChance: 0,
        gameRoomId: gameRoom.id,
    });
    const rocketPokemon2 = yield (0, generateWildPokemon_1.generateWildPokemon)({
        baseData: basePokemons[Math.floor(Math.random() * basePokemons.length)],
        isAdult: true,
        level: gameRoom.level + Math.floor(Math.random() * 5),
        savage: false,
        shinyChance: 0,
        gameRoomId: gameRoom.id,
    });
    if (!rocketPokemon1)
        throw new AppErrors_1.UnexpectedError('Failed to create rocketpokemon1');
    if (!rocketPokemon2)
        throw new AppErrors_1.UnexpectedError('Failed to create rocketpokemon2');
    const announcementText = `A equipe rocket invadiu a ROTA ${gameRoom.id}!
    Para impedi-los, será necessário formar uma equipe de 2 treinadores.
    👍 - juntar-se`;
    const rocketInvasion = yield prisma.invasionSession.create({
        data: {
            announcementText,
            creatorId: gameRoom.id,
            gameRoomId: gameRoom.id,
            mode: '2-rocket-invasion',
            cashReward: 50 + 5 * Math.pow(gameRoom.level, 1.3),
            forfeitCost: 400 + 20 * Math.pow(gameRoom.level, 1.3),
            enemyPokemons: {
                connect: [{ id: rocketPokemon1.id }, { id: rocketPokemon2.id }],
            },
            // TO-DO
            name: 'Equipe rocket',
            requiredPlayers: 2,
        },
    });
    const imageUrl = yield (0, iGenWildPokemon_1.iGenWildPokemon)({
        pokemon: rocketPokemon1,
    });
    const media = whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
    const result = yield zap.sendMessage(gameRoom.phone, media, {
        caption: announcementText,
    });
    yield prisma.message.create({
        data: {
            msgId: result.id.id,
            type: '?',
            body: '',
            actions: [`pz. battle invasion ${rocketInvasion.id}`],
        },
    });
});
exports.rocketDuoInvasion = rocketDuoInvasion;
