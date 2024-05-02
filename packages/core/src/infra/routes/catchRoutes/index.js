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
exports.catchRoutes = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../errors/AppErrors");
const logger_1 = require("../../logger");
const ballNameMap = new Map([
    // POKE-BALL
    ['POKEBALL', 'poke-ball'],
    ['POKE-BALL', 'poke-ball'],
    ['POKEBOLA', 'poke-ball'],
    ['POKE-BOLA', 'poke-ball'],
    // GREAT-BALL
    ['GREATBALL', 'great-ball'],
    ['GREAT-BALL', 'great-ball'],
    ['GREATBOLA', 'great-ball'],
    ['GREAT-BOLA', 'great-ball'],
    // ULTRA-BALL
    ['ULTRABALL', 'ultra-ball'],
    ['ULTRA-BALL', 'ultra-ball'],
    ['ULTRABOLA', 'ultra-ball'],
    ['ULTRA-BOLA', 'ultra-ball'],
    // SPECIAL-BALL
    ['SORABALL', 'sora-ball'],
    ['SORA-BALL', 'sora-ball'],
    ['MAGUBALL', 'magu-ball'],
    ['MAGU-BALL', 'magu-ball'],
    ['TALEBALL', 'tale-ball'],
    ['TALE-BALL', 'tale-ball'],
    ['JANGURUBALL', 'janguru-ball'],
    ['JANGURU-BALL', 'janguru-ball'],
    ['MOONBALL', 'moon-ball'],
    ['MOON-BALL', 'moon-ball'],
    ['TINKERBALL', 'tinker-ball'],
    ['TINKER-BALL', 'tinker-ball'],
    ['YUMEBALL', 'yume-ball'],
    ['YUME-BALL', 'yume-ball'],
    ['DUSKBALL', 'dusk-ball'],
    ['DUSK-BALL', 'dusk-ball'],
    ['NETBALL', 'net-ball'],
    ['NET-BALL', 'net-ball'],
    ['BEASTBALL', 'beast-ball'],
    ['BEAST-BALL', 'beast-ball'],
    ['MASTERBALL', 'master-ball'],
    ['MASTER-BALL', 'master-ball'],
]);
const catchRoutes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , givenBallName, givenId] = data.routeParams;
    const pokemonId = Number(givenId);
    if (!pokemonId || isNaN(pokemonId) || !givenBallName)
        throw new AppErrors_1.MissingParametersCatchRouteError();
    const ballName = ballNameMap.get(givenBallName);
    if (!ballName)
        throw new AppErrors_1.InvalidPokeBallName(givenBallName);
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            ownedItems: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemon = yield src_1.default.pokemon.findFirst({
        where: {
            id: pokemonId,
        },
        include: {
            baseData: true,
            defeatedBy: true,
            ranAwayFrom: true,
        },
    });
    if (!pokemon)
        throw new AppErrors_1.PokemonNotFoundError(pokemonId);
    if (!pokemon.savage || pokemon.ownerId)
        throw new AppErrors_1.PokemonAlreadyHasOwnerError(pokemonId, data.playerName);
    if (!pokemon.defeatedBy.map(player => player.id).includes(player.id))
        throw new AppErrors_1.PlayerDidNotDefeatPokemonError(player.name);
    if (pokemon.ranAwayFrom.map(player => player.id).includes(player.id))
        throw new AppErrors_1.CatchFailedPokemonRanAwayError(pokemon.id, player.name);
    const pokeball = yield src_1.default.item.findFirst({
        where: {
            ownerId: player.id,
            baseItem: {
                name: ballName,
            },
        },
        include: {
            baseItem: true,
        },
    });
    if (!pokeball || pokeball.amount <= 0)
        throw new AppErrors_1.PlayerDoesNotHaveItemError(data.playerName, ballName);
    yield src_1.default.item.updateMany({
        where: {
            id: pokeball.id,
        },
        data: {
            amount: {
                decrement: 1,
            },
        },
    });
    function calculateCatchRate(baseExp) {
        const x = (baseExp + 10) / 304; // scale baseExp from 36-340 to 0-1
        const catchRate = 1 - Math.exp(-3 * x);
        return Math.min(1 - catchRate);
    }
    const getBallRateMultiplier = () => {
        if (ballName === 'poke-ball')
            return 0.65;
        if (ballName === 'great-ball')
            return 1.1;
        if (ballName === 'ultra-ball')
            return 2.2;
        if (ballName === 'sora-ball') {
            if (['ice', 'flying'].includes(pokemon.baseData.type1Name) ||
                ['ice', 'flying'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'magu-ball') {
            if (['fire', 'earth'].includes(pokemon.baseData.type1Name) ||
                ['fire', 'earth'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'tale-ball') {
            if (['fairy', 'dragon'].includes(pokemon.baseData.type1Name) ||
                ['fairy', 'dragon'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'janguru-ball') {
            if (['grass', 'poison'].includes(pokemon.baseData.type1Name) ||
                ['grass', 'poison'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'tinker-ball') {
            if (['electric', 'steel'].includes(pokemon.baseData.type1Name) ||
                ['electric', 'steel'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'yume-ball') {
            if (['psychic', 'normal'].includes(pokemon.baseData.type1Name) ||
                ['psychic', 'normal'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'moon-ball') {
            if (['dark', 'ghost'].includes(pokemon.baseData.type1Name) ||
                ['dark', 'ghost'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'dusk-ball') {
            if (['fighting', 'rock'].includes(pokemon.baseData.type1Name) ||
                ['fighting', 'rock'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'net-ball') {
            if (['bug', 'water'].includes(pokemon.baseData.type1Name) ||
                ['bug', 'water'].includes(pokemon.baseData.type2Name || ''))
                return 10;
            return 0.4;
        }
        if (ballName === 'beast-ball')
            return 40;
        if (ballName === 'master-ball')
            return 9999999;
        return 0.4;
    };
    const shinyMultiplier = pokemon.isShiny ? 0.02 : 1;
    const regionalMultiplier = pokemon.baseData.isRegional ? 0.7 : 1;
    const catchRate = calculateCatchRate(pokemon.isShiny ? 170 : pokemon.baseData.BaseExperience) *
        getBallRateMultiplier() *
        shinyMultiplier *
        regionalMultiplier;
    const random = Math.random();
    logger_1.logger.info(`${player.name} ${catchRate > random ? 'catches' : 'fails to catch'} #${pokemon.id} ${pokemon.isShiny ? 'SHINY' : ''} ${pokemon.baseData.name}. BALL: ${ballName}, CHANCE: ${catchRate}`);
    if (catchRate > random) {
        yield src_1.default.pokemon.updateMany({
            where: {
                id: pokemon.id,
            },
            data: {
                savage: false,
                ownerId: player.id,
            },
        });
        yield src_1.default.player.update({
            where: {
                id: player.id,
            },
            data: {
                caughtDbIds: {
                    push: pokemon.id,
                },
                caughtDexIds: {
                    push: pokemon.baseData.pokedexId,
                },
            },
        });
        return {
            message: `${pokemon.baseData.name.toUpperCase()} foi capturado por ${data.playerName}!`,
            status: 200,
            data: null,
        };
    }
    yield src_1.default.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            ranAwayFrom: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
    return {
        message: `Sinto muito ${data.playerName}, sua ${ballName} quebrou. Restam ${pokeball.amount - 1} ${ballName}.`,
        status: 200,
        data: null,
    };
});
exports.catchRoutes = catchRoutes;
