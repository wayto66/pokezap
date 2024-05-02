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
exports.checkEvolutionPermition = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const generateGeneralStats_1 = require("./generateGeneralStats");
const generateHpStat_1 = require("./generateHpStat");
const checkEvolutionPermition = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const client = tsyringe_1.container.resolve('PrismaClient');
    const { preferredPokemonName } = data;
    const poke = yield client.pokemon.findFirst({
        where: {
            id: data.pokemonId,
            ownerId: data.playerId,
        },
        include: {
            baseData: true,
        },
    });
    const player = yield client.player.findFirst({
        where: {
            id: data.playerId,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerId.toString());
    if (!poke)
        throw new AppErrors_1.PokemonNotFoundError(data.pokemonId);
    if (poke.ownerId !== player.id)
        throw new AppErrors_1.PlayerDoestNotOwnThePokemonError(poke.id, player.name);
    const fullData = poke.baseData.evolutionData;
    const evData = fullData.evolutionChain[0];
    if (!evData)
        return {
            message: '',
            status: 'no-evdata',
        };
    const getCurrentPosition = () => {
        var _a, _b, _c;
        if (poke.baseData.isFirstEvolution)
            return 0;
        if (poke.baseData.name === ((_a = evData === null || evData === void 0 ? void 0 : evData.species) === null || _a === void 0 ? void 0 : _a.name))
            return 1;
        if (poke.baseData.name === ((_c = (_b = evData === null || evData === void 0 ? void 0 : evData.evolves_to[0]) === null || _b === void 0 ? void 0 : _b.species) === null || _c === void 0 ? void 0 : _c.name))
            return 2;
        return -1;
    };
    const currentPosition = getCurrentPosition();
    if (currentPosition === 2 && !data.fromTrade)
        throw new AppErrors_1.PokemonAlreadyOnLastEvolution(poke.id, poke.baseData.name);
    if (currentPosition === 2 && data.fromTrade)
        return {
            message: 'already on last evolution',
            status: 'not-evolved',
        };
    if (currentPosition === -1)
        throw new AppErrors_1.UnexpectedError('Não foi possível localizar a posição do pokemon na cadeia evolutiva.');
    let evoData = null;
    if (currentPosition === 0)
        evoData = evData;
    if (currentPosition === 1)
        evoData = evData.evolves_to[0];
    if (preferredPokemonName && currentPosition === 0) {
        console.log(evData.evolves_to);
        evoData = fullData.evolutionChain.find((data) => data.species.name === preferredPokemonName);
        if (!evoData)
            throw new AppErrors_1.PokemonNotFoundError(preferredPokemonName);
    }
    if (evoData === null) {
        return {
            message: '',
            status: 'evodata-null',
        };
    }
    const evoTrigger = (_a = evoData === null || evoData === void 0 ? void 0 : evoData.evolution_details[0]) === null || _a === void 0 ? void 0 : _a.trigger;
    if ((evoTrigger === null || evoTrigger === void 0 ? void 0 : evoTrigger.name) !== 'trade' && data.fromTrade)
        return {
            message: 'trigger is not trade',
            status: 'not-evolved',
        };
    if (!evoTrigger)
        throw new AppErrors_1.PokemonAlreadyOnLastEvolution(poke.id, poke.baseData.name);
    if (!['trade', 'level-up', 'use-item'].includes(evoTrigger.name)) {
        return {
            message: 'Infelizmente o modo de evolução do seu Pokemon ainda não foi implementado.',
            status: 'evo-trigger-unsupported',
        };
    }
    if (evoTrigger.name === 'trade' && !data.fromTrade)
        throw new AppErrors_1.UnknownEvolutionMethodError(poke.id, poke.baseData.name);
    if (evoTrigger.name === 'level-up' && poke.level < (evoData.evolution_details[0].min_level || 15))
        throw new AppErrors_1.InsufficientLevelToEvolveError(poke.id, poke.baseData.name, evoData.evolution_details[0].min_level || 15);
    if (evoTrigger.name === 'use-item' || (evoTrigger.name === 'trade' && ((_b = evoData.evolution_details[0].held_item) === null || _b === void 0 ? void 0 : _b.name))) {
        const requiredItemName = (_e = (_d = (_c = evoData === null || evoData === void 0 ? void 0 : evoData.evolution_details[0]) === null || _c === void 0 ? void 0 : _c.item) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : (_f = evoData.evolution_details[0].held_item) === null || _f === void 0 ? void 0 : _f.name;
        if (!requiredItemName)
            throw new AppErrors_1.UnexpectedError('Não foi possível obter o nome do item requirido para evolução.');
        const requiredItem = yield client.item.findFirst({
            where: {
                ownerId: poke.ownerId,
                baseItem: {
                    name: requiredItemName,
                },
            },
        });
        if (!requiredItem || requiredItem.amount <= 0)
            throw new AppErrors_1.PlayerDoesNotHaveItemError(player.name, requiredItemName);
        yield client.item.update({
            where: {
                id: requiredItem.id,
            },
            data: {
                amount: {
                    decrement: 1,
                },
            },
        });
    }
    const evoToPoke = yield client.basePokemon.findFirst({
        where: {
            name: evoData.species.name,
        },
    });
    if (!evoToPoke)
        throw new AppErrors_1.UnexpectedError('Não foi possível encontrar basePokemon: ' + evoData.species.name);
    const regionalMultiplier = evoToPoke.isRegional ? 1.05 : 1;
    const evolvedPoke = poke.isShiny
        ? yield client.pokemon.update({
            where: {
                id: data.pokemonId,
            },
            data: {
                baseData: {
                    connect: {
                        id: evoToPoke.id,
                    },
                },
                spriteUrl: evoToPoke.shinySpriteUrl,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(evoToPoke.BaseHp, poke.level) * 1.15 * regionalMultiplier),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseAtk, poke.level) * 1.15 * regionalMultiplier),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseDef, poke.level) * 1.15 * regionalMultiplier),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpAtk, poke.level) * 1.15 * regionalMultiplier),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpDef, poke.level) * 1.15 * regionalMultiplier),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpeed, poke.level) * 1.15 * regionalMultiplier),
            },
            include: {
                baseData: true,
            },
        })
        : yield client.pokemon.update({
            where: {
                id: data.pokemonId,
            },
            data: {
                baseData: {
                    connect: {
                        id: evoToPoke.id,
                    },
                },
                spriteUrl: evoToPoke.defaultSpriteUrl,
                hp: (0, generateHpStat_1.generateHpStat)(evoToPoke.BaseHp, poke.level),
                atk: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseAtk, poke.level),
                def: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseDef, poke.level),
                spAtk: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpAtk, poke.level),
                spDef: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpDef, poke.level),
                speed: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpeed, poke.level),
            },
            include: {
                baseData: true,
            },
        });
    return {
        message: `${poke.baseData.name} evoluiu para ${evolvedPoke.baseData.name}!`,
        status: 'evolved',
    };
});
exports.checkEvolutionPermition = checkEvolutionPermition;
//# sourceMappingURL=checkEvolutionPermition.js.map