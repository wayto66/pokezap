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
exports.wildPokeSpawn = void 0;
const tsyringe_1 = require("tsyringe");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const metaValues_1 = require("../../../constants/metaValues");
const iGenWildPokemon_1 = require("../../modules/imageGen/iGenWildPokemon");
const generateWildPokemon_1 = require("../../modules/pokemon/generate/generateWildPokemon");
const windPokeEvolve_1 = require("../../modules/pokemon/windPokeEvolve");
const wildPokeSpawn = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const gameRooms = yield prismaClient.gameRoom.findMany({
        where: {
            statusTrashed: false,
        },
        include: {
            players: true,
        },
    });
    for (const gameRoom of gameRooms) {
        if (!gameRoom.phone)
            continue;
        if (gameRoom.mode !== 'route')
            continue;
        if (gameRoom.invasorId && Math.random() < 0.5) {
            data.zapClient.sendMessage(gameRoom.phone, `Um pokemon selvagem apareceu na rota, mas foi afugentado por algum invasor.
    (utilize o comando: "route verify" ou "route forfeit")`);
            continue;
        }
        if (data.needIncense &&
            (!gameRoom.activeIncense ||
                gameRoom.activeIncense === 'none' ||
                !gameRoom.incenseCharges ||
                gameRoom.incenseCharges <= 0))
            continue;
        const baseExperienceTreshold = Math.floor(64 + (gameRoom.level / 100) * 276);
        const getIncenseTypes = () => {
            if (gameRoom.incenseElements.length > 0) {
                return [
                    {
                        type1Name: {
                            in: gameRoom.incenseElements,
                        },
                    },
                    {
                        type2Name: {
                            in: gameRoom.incenseElements,
                        },
                    },
                ];
            }
            return undefined;
        };
        const basePokemons = gameRoom.region
            ? yield prismaClient.basePokemon.findMany({
                where: {
                    BaseExperience: {
                        lte: baseExperienceTreshold,
                    },
                    name: {
                        contains: `-${gameRoom.region}`,
                    },
                    isMega: false,
                    isRegional: true,
                    OR: getIncenseTypes(),
                },
                include: {
                    skills: true,
                },
            })
            : yield prismaClient.basePokemon.findMany({
                where: {
                    BaseExperience: {
                        lte: baseExperienceTreshold,
                    },
                    isMega: false,
                    isRegional: false,
                    isFirstEvolution: true,
                    OR: getIncenseTypes(),
                },
                include: {
                    skills: true,
                },
            });
        const baseData = basePokemons[Math.floor(Math.random() * basePokemons.length)];
        const level = gameRoom.levelLock
            ? Math.floor(Math.min(1 + Math.random() * gameRoom.levelLock, 100))
            : Math.floor(Math.min(1 + Math.random() * gameRoom.level, 100));
        const getShinyChance = () => {
            if (!gameRoom.incenseCharges || gameRoom.incenseCharges <= 0)
                return 0.025;
            if (gameRoom.activeIncense === 'shiny-incense')
                return 0.12;
            return 0.085;
        };
        const shinyChance = getShinyChance();
        const newWildPokemonPreEvolve = yield (0, generateWildPokemon_1.generateWildPokemon)({
            baseData,
            level,
            shinyChance,
            savage: true,
            isAdult: true,
            gameRoomId: gameRoom.id,
            fromIncense: true,
        });
        const newWildPokemon = yield (0, windPokeEvolve_1.windPokeEvolve)(yield (0, windPokeEvolve_1.windPokeEvolve)(newWildPokemonPreEvolve, baseExperienceTreshold), baseExperienceTreshold);
        if (data.needIncense) {
            yield prismaClient.gameRoom.update({
                where: {
                    id: gameRoom.id,
                },
                data: {
                    incenseCharges: {
                        decrement: 1,
                    },
                },
            });
        }
        const imageUrl = yield (0, iGenWildPokemon_1.iGenWildPokemon)({
            pokemon: newWildPokemon,
        });
        const media = whatsapp_web_js_1.MessageMedia.fromFilePath(imageUrl);
        const displayName = newWildPokemon.isShiny
            ? `shiny ${newWildPokemon.baseData.name}`
            : `${newWildPokemon.baseData.name}`;
        data.zapClient
            .sendMessage(gameRoom.phone, media, {
            caption: `Um *${displayName}* selvagem de nível ${newWildPokemon.level} acaba de ${data.needIncense ? 'ser atraído pelo incenso' : 'aparecer'}!
Ações:
👍 - Batalhar
❤ - Batalhar
`,
        })
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            yield prismaClient.message.create({
                data: {
                    msgId: result.id.id,
                    type: '?',
                    body: '',
                    actions: [`pokezap. battle ${newWildPokemon.id} fast`, `pz. battle ${newWildPokemon.id} fast`],
                },
            });
        }));
        setTimeout(() => {
            pokemonRanAwayWarning({ prismaClient, newWildPokemon, data, gameRoom });
        }, metaValues_1.metaValues.wildPokemonFleeTimeInSeconds * 1000);
    }
});
exports.wildPokeSpawn = wildPokeSpawn;
const pokemonRanAwayWarning = ({ prismaClient, newWildPokemon, data, gameRoom }) => __awaiter(void 0, void 0, void 0, function* () {
    const pokemon = yield prismaClient.pokemon.findFirst({
        where: {
            id: newWildPokemon.id,
        },
        include: {
            defeatedBy: true,
            baseData: true,
        },
    });
    if (!pokemon)
        return;
    if (pokemon.defeatedBy.length === 0) {
        data.zapClient.sendMessage(gameRoom.phone, `#${pokemon.id} - ${pokemon.baseData.name} fugiu.`);
    }
});
//# sourceMappingURL=wildPokeSpawn.js.map