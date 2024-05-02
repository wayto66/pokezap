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
exports.getRegionalEvolutionData = exports.handleAlolaGalarEvolution = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const generateGeneralStats_1 = require("./generateGeneralStats");
const generateHpStat_1 = require("./generateHpStat");
const handleAlolaGalarEvolution = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { pokemon, fromTrade } = data;
    const client = tsyringe_1.container.resolve('PrismaClient');
    const player = yield client.player.findFirst({
        where: {
            id: pokemon.ownerId || 0,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError((pokemon.ownerId || 0).toString());
    if (!pokemon.ownerId)
        throw new AppErrors_1.PokemonDoesNotHaveOwnerError(pokemon.id, pokemon.baseData.name);
    const evData = (0, exports.getRegionalEvolutionData)(pokemon.baseData);
    if ((evData === null || evData === void 0 ? void 0 : evData.evolveTo) !== '' && (evData === null || evData === void 0 ? void 0 : evData.evolveTo[0].split('-')[1]) !== data.currentRegion)
        throw new AppErrors_1.WrongRegionToEvolveError(pokemon.baseData.name);
    if (!evData)
        return {
            evolved: false,
            errorMessage: 'no-evData',
        };
    if (evData.evolveTo === '')
        return {
            evolved: false,
            errorMessage: 'no-evolveTo',
        };
    if (evData.trigger.name === 'trade' && !fromTrade)
        throw new AppErrors_1.UnknownEvolutionMethodError(pokemon.id, pokemon.baseData.name);
    if (evData.trigger.name === 'level-up' && pokemon.level < Number(evData.trigger.requires))
        throw new AppErrors_1.InsufficientLevelToEvolveError(pokemon.id, pokemon.baseData.name, Number(evData.trigger.requires) || 15);
    if (evData.trigger.name === 'use-item' || (evData.trigger.name === 'trade' && evData.trigger.requires !== '')) {
        const requiredItemName = evData.trigger.requires;
        if (!requiredItemName)
            throw new AppErrors_1.UnexpectedError('Não foi possível obter o nome do item requirido para evolução.');
        const requiredItem = yield client.item.findFirst({
            where: {
                ownerId: pokemon.ownerId,
                baseItem: {
                    name: requiredItemName.toString(),
                },
            },
        });
        if (!requiredItem || requiredItem.amount <= 0)
            throw new AppErrors_1.PlayerDoesNotHaveItemError(player.name, requiredItemName.toString());
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
    const targetEvolution = evData.evolveTo[0];
    const evoToPoke = yield client.basePokemon.findFirst({
        where: {
            name: targetEvolution,
        },
    });
    if (!evoToPoke)
        throw new AppErrors_1.UnexpectedError('Não foi possível encontrar a evolução com nome: ' + targetEvolution);
    const evolvedPoke = pokemon.isShiny
        ? yield client.pokemon.update({
            where: {
                id: data.pokemon.id,
            },
            data: {
                baseData: {
                    connect: {
                        id: evoToPoke.id,
                    },
                },
                spriteUrl: evoToPoke.shinySpriteUrl,
                hp: Math.round((0, generateHpStat_1.generateHpStat)(evoToPoke.BaseHp, pokemon.level) * 1.15),
                atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseAtk, pokemon.level) * 1.15),
                def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseDef, pokemon.level) * 1.15),
                spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpAtk, pokemon.level) * 1.15),
                spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpDef, pokemon.level) * 1.15),
                speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpeed, pokemon.level) * 1.15),
            },
            include: {
                baseData: true,
            },
        })
        : yield client.pokemon.update({
            where: {
                id: data.pokemon.id,
            },
            data: {
                baseData: {
                    connect: {
                        id: evoToPoke.id,
                    },
                },
                spriteUrl: evoToPoke.defaultSpriteUrl,
                hp: (0, generateHpStat_1.generateHpStat)(evoToPoke.BaseHp, pokemon.level),
                atk: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseAtk, pokemon.level),
                def: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseDef, pokemon.level),
                spAtk: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpAtk, pokemon.level),
                spDef: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpDef, pokemon.level),
                speed: (0, generateGeneralStats_1.generateGeneralStats)(evoToPoke.BaseSpeed, pokemon.level),
            },
            include: {
                baseData: true,
            },
        });
    return {
        pokemon: evolvedPoke,
        evolved: true,
    };
});
exports.handleAlolaGalarEvolution = handleAlolaGalarEvolution;
const getRegionalEvolutionData = (baseData) => {
    const regionPokemonCECPMap = new Map([
        [
            'vulpix-alola',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'ice-stone',
                },
                evolveTo: ['ninetales-alola'],
            },
        ],
        [
            'ninetales-alola',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'ice-stone',
                },
                evolveTo: '',
            },
        ],
        [
            'diglett-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 26,
                },
                evolveTo: ['dugtrio-alola'],
            },
        ],
        [
            'dugtrio-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 26,
                },
                evolveTo: '',
            },
        ],
        [
            'meowth-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 28,
                },
                evolveTo: ['persian-alola'],
            },
        ],
        [
            'geodude-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 25,
                },
                evolveTo: ['graveler-alola'],
            },
        ],
        [
            'graveler-alola',
            {
                trigger: {
                    name: 'trade',
                    requires: '',
                },
                evolveTo: ['golem-alola'],
            },
        ],
        [
            'graveler-alola',
            {
                trigger: {
                    name: 'trade',
                    requires: '',
                },
                evolveTo: '',
            },
        ],
        [
            'grimer-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 38,
                },
                evolveTo: ['muk-alola'],
            },
        ],
        [
            'muk-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 38,
                },
                evolveTo: '',
            },
        ],
        [
            'sandshrew-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 22,
                },
                evolveTo: ['sandslash-alola'],
            },
        ],
        [
            'sandslash-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 22,
                },
                evolveTo: '',
            },
        ],
        [
            'pikachu',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'thunder-stone',
                },
                evolveTo: ['raichu-alola'],
            },
        ],
        [
            'raichu-alola',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'thunder-stone',
                },
                evolveTo: '',
            },
        ],
        [
            'rattata-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 20,
                },
                evolveTo: ['raticate-alola'],
            },
        ],
        [
            'raticate-alola',
            {
                trigger: {
                    name: 'level-up',
                    requires: 20,
                },
                evolveTo: '',
            },
        ],
        [
            'cubone',
            {
                trigger: {
                    name: 'level-up',
                    requires: 28,
                },
                evolveTo: ['marowak-alola'],
            },
        ],
        [
            'exeggcute',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'leaf-stone',
                },
                evolveTo: ['exeggutor-alola'],
            },
        ],
        [
            'exeggutor-alola',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'leaf-stone',
                },
                evolveTo: '',
            },
        ],
        [
            'meowth-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 28,
                },
                evolveTo: ['persian-galar'],
            },
        ],
        [
            'ponyta-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 40,
                },
                evolveTo: ['rapidash-galar'],
            },
        ],
        [
            'rapidash-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 40,
                },
                evolveTo: '',
            },
        ],
        [
            'slowpoke-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'galarica-cuff',
                },
                evolveTo: ['slowbro-galar'],
            },
        ],
        [
            'koffing',
            {
                trigger: {
                    name: 'level-up',
                    requires: 35,
                },
                evolveTo: ['weezing-galar'],
            },
        ],
        [
            'weezing-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 35,
                },
                evolveTo: '',
            },
        ],
        [
            'mime-jr',
            {
                trigger: {
                    name: 'level-up',
                    requires: 32,
                },
                evolveTo: ['mr-mime-galar'],
            },
        ],
        [
            'mr-mime-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 32,
                },
                evolveTo: '',
            },
        ],
        [
            'articuno-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'crackling-ice',
                },
                evolveTo: 'articuno-galar',
            },
        ],
        [
            'zapdos-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'galarica-wreath',
                },
                evolveTo: 'zapdos-galar',
            },
        ],
        [
            'moltres-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'crackling-ice',
                },
                evolveTo: 'moltres-galar',
            },
        ],
        [
            'slowbro-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'galarica-wreath',
                },
                evolveTo: ['slowking-galar'],
            },
        ],
        [
            'slowking-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'galarica-wreath',
                },
                evolveTo: '',
            },
        ],
        /*     [
          'corsola-galar',
          {
            trigger: {
              name: 'level-up',
              requires: 38,
            },
            evolveTo: 'cursola-galar',
          },
        ], */
        [
            'zigzagoon-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 20,
                },
                evolveTo: ['linoone-galar'],
            },
        ],
        [
            'linoone-galar',
            {
                trigger: {
                    name: 'level-up',
                    requires: 20,
                },
                evolveTo: '',
            },
        ],
        [
            'darumaka-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'ice-stone',
                },
                evolveTo: ['darmanitan-galar', 'darmanitan-galar-zen'],
            },
        ],
        [
            'darmanitan-galar',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'ice-stone',
                },
                evolveTo: '',
            },
        ],
        [
            'darmanitan-galar-zen',
            {
                trigger: {
                    name: 'use-item',
                    requires: 'ice-stone',
                },
                evolveTo: '',
            },
        ],
    ]);
    return regionPokemonCECPMap.get(baseData.name);
};
exports.getRegionalEvolutionData = getRegionalEvolutionData;
//# sourceMappingURL=handleAlolaGalarEvolution.js.map