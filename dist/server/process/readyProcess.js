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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readyProcess = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const tsyringe_1 = require("tsyringe");
const metaValues_1 = require("../../constants/metaValues");
const logger_1 = require("../../infra/logger");
const pokeBossInvasion_1 = require("../../server/serverActions/cron/pokeBossInvasion");
const wildPokeSpawn_1 = require("../../server/serverActions/cron/wildPokeSpawn");
const deleteSentMessage_1 = require("../helpers/deleteSentMessage");
const generateGymPokemons_1 = require("../modules/pokemon/generate/generateGymPokemons");
const rocketInvasion_1 = require("../serverActions/cron/rocketInvasion");
const readyProcess = (zapIstanceName) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const zapClient = tsyringe_1.container.resolve(zapIstanceName);
    node_cron_1.default.schedule(`*/${metaValues_1.metaValues.wildPokemonFleeTimeInMinutes} * * * *`, () => {
        logger_1.logger.info(`Natural wild pokemon spawn`);
        (0, wildPokeSpawn_1.wildPokeSpawn)({
            prismaClient,
            zapClient,
        });
    });
    node_cron_1.default.schedule('*/4 * * * *', () => {
        logger_1.logger.info('Running incense cron');
        (0, wildPokeSpawn_1.wildPokeSpawn)({
            prismaClient,
            zapClient,
            needIncense: true,
        });
    });
    node_cron_1.default.schedule('0 0 */4 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info('Running cp cron');
        const gameRooms = yield prismaClient.gameRoom.findMany({
            where: {
                mode: 'route',
                upgrades: {
                    some: {
                        base: {
                            name: 'pokemon-center',
                        },
                    },
                },
            },
            include: {
                players: true,
            },
        });
        for (const gameRoom of gameRooms) {
            yield prismaClient.player.updateMany({
                where: {
                    id: {
                        in: gameRoom.players.map(player => player.id),
                    },
                },
                data: {
                    energy: {
                        increment: 2,
                    },
                },
            });
            try {
                const result = yield zapClient.sendMessage(gameRoom.phone, `🔋💞 Centro pokemon da rota *#${gameRoom.id}* acaba de fornecer 2 energia extra! 🔋💞`);
                (0, deleteSentMessage_1.deleteSentMessage)(result);
            }
            catch (e) { }
        }
    }));
    node_cron_1.default.schedule('0 0 */12 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info('Running energy reset cron');
        yield prismaClient.player.updateMany({
            data: {
                energy: 10,
            },
        });
    }));
    node_cron_1.default.schedule(`0 0 */5 * * *`, () => __awaiter(void 0, void 0, void 0, function* () {
        (0, pokeBossInvasion_1.pokeBossInvasion)({
            zapClient,
        });
    }));
    node_cron_1.default.schedule(`0 0 */3 * * *`, () => __awaiter(void 0, void 0, void 0, function* () {
        (0, rocketInvasion_1.rocketInvasion)(zapClient);
    }));
    const creategympokes = false;
    if (creategympokes) {
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'poliwrath',
            ownerId: 1,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'ludicolo',
            ownerId: 1,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'crawdaunt',
            ownerId: 1,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'slowking',
            ownerId: 1,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'omastar',
            ownerId: 1,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'blastoise-mega',
            ownerId: 1,
        });
        /// /
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'poliwrath',
            ownerId: 2,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'magcargo',
            ownerId: 2,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'rhydon',
            ownerId: 2,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'lunatone',
            ownerId: 2,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'aerodactyl',
            ownerId: 2,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'tyranitar-mega',
            ownerId: 2,
        });
        ///
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'galvantula',
            ownerId: 3,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'rotom',
            ownerId: 3,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'magnezone',
            ownerId: 3,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'emolga',
            ownerId: 3,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'lanturn',
            ownerId: 3,
        });
        (0, generateGymPokemons_1.generateGymPokemons)({
            level: 90,
            name: 'ampharos-mega',
            ownerId: 3,
        });
    }
});
exports.readyProcess = readyProcess;
//# sourceMappingURL=readyProcess.js.map