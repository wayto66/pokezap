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
exports.populateMegas = exports.populate = exports.stealItems = exports.thiefTimeMoves = exports.thiefTime = void 0;
const fs_1 = require("fs");
const node_fetch_1 = __importDefault(require("node-fetch"));
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const logger_1 = require("../infra/logger");
const data_1 = require("./data");
const items_1 = require("./items");
const moves_1 = require("./moves");
const specialPokemons_1 = require("./specialPokemons");
function thiefTime() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'https://pokeapi.co/api/v2';
        const endpoint = '/pokemon/';
        // Fetch data for the first 151 Pokemon
        const limit = 500;
        const url = `${baseUrl}${endpoint}?limit=${limit}&offset=1030`;
        (0, node_fetch_1.default)(url)
            .then(response => response.json())
            .then(data => {
            // Map each Pokemon to a new object with name and types properties
            const pokemonData = data.results.map((pokemon) => ({
                name: pokemon.name,
                types: [],
                sprites: [],
            }));
            // Fetch additional data for each Pokemon and add types to the objects
            Promise.all(pokemonData.map((pokemon) => {
                const url = `${baseUrl}${endpoint}${pokemon.name}`;
                return (0, node_fetch_1.default)(url)
                    .then(response => response.json())
                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                    pokemon.id = data.id;
                    pokemon.baseExperience = data.base_experience;
                    pokemon.height = data.height;
                    pokemon.stats = {
                        hp: data.stats[0].base_stat,
                        atk: data.stats[1].base_stat,
                        def: data.stats[2].base_stat,
                        spAtk: data.stats[3].base_stat,
                        spDef: data.stats[4].base_stat,
                        speed: data.stats[5].base_stat,
                    };
                    const moves = data.moves.filter((move) => {
                        return move.version_group_details.some((detail) => {
                            return !detail.move_learn_method.name.includes('egg');
                        });
                    });
                    pokemon.moves = moves.map((move) => {
                        const getLevelLearned = move.version_group_details.find((detail) => {
                            return detail.level_learned_at !== 0;
                        });
                        const levelLearned = getLevelLearned ? getLevelLearned.level_learned_at : 0;
                        return {
                            name: move.move.name,
                            level: levelLearned,
                        };
                    });
                    pokemon.types = data.types.map((type) => type.type.name);
                    pokemon.isDualType = pokemon.types.length !== 1;
                    pokemon.sprites = {
                        normal: data.sprites.front_default,
                        shiny: data.sprites.front_shiny,
                    };
                    const speciesResponse = yield (0, node_fetch_1.default)(data.species.url);
                    const speciesData = yield speciesResponse.json();
                    const evolutionChainResponse = yield (0, node_fetch_1.default)(speciesData.evolution_chain.url);
                    const evolutionData = yield evolutionChainResponse.json();
                    pokemon.evolutionData = {};
                    pokemon.evolutionData.isFirstEvolution = evolutionData.chain.species.name === pokemon.name;
                    const evoto = evolutionData.chain.evolves_to;
                    pokemon.evolutionData.evolutionChain = evoto;
                    return pokemon;
                }));
            })).then(data => {
                const dataString = `export const pokemonData = ${JSON.stringify(data)};`;
                // Write data to file
                const filename = 'mega-alola-galar_data.ts';
                (0, fs_1.writeFileSync)(filename, dataString);
                logger_1.logger.info(`Data written to ${filename}`);
            });
        })
            .catch(error => logger_1.logger.error(error));
    });
}
exports.thiefTime = thiefTime;
function thiefTimeMoves() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'https://pokeapi.co/api/v2';
        const endpoint = '/move/';
        // Fetch data for the first 151 Pokemon
        const limit = 920;
        const url = `${baseUrl}${endpoint}?limit=${limit}`;
        (0, node_fetch_1.default)(url)
            .then(response => response.json())
            .then(data => {
            // Map each Pokemon to a new object with name and types properties
            const moveData = data.results.map((move) => ({
                name: move.name,
            }));
            // Fetch additional data for each Pokemon and add types to the objects
            Promise.all(moveData.map((move) => {
                const url = `${baseUrl}${endpoint}${move.name}`;
                return (0, node_fetch_1.default)(url)
                    .then(response => response.json())
                    .then(data => {
                    move.id = data.id;
                    move.type = data.type.name;
                    move.target = data.target.name;
                    move.pp = data.pp;
                    move.class = data.damage_class.name;
                    move.power = data.power;
                    move.statChanges = data.stat_changes.map((data) => {
                        return {
                            change: data.change,
                            stat: data.stat.name,
                        };
                    });
                    return move;
                });
            })).then(data => {
                const dataString = `export const pokemonData = ${JSON.stringify(data)};`;
                // Write data to file
                const filename = 'moves.ts';
                (0, fs_1.writeFileSync)(filename, dataString);
                logger_1.logger.info(`Data written to ${filename}`);
            });
        })
            .catch(error => logger_1.logger.error(error));
    });
}
exports.thiefTimeMoves = thiefTimeMoves;
function stealItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = 'https://pokeapi.co/api/v2';
        const endpoint = '/item/';
        // Fetch data for the first 151 Pokemon
        const limit = 709;
        const url = `${baseUrl}${endpoint}?limit=${limit}`;
        (0, node_fetch_1.default)(url)
            .then(response => response.json())
            .then(data => {
            // Map each Pokemon to a new object with name and types properties
            const itemData = data.results.map((item) => ({
                name: item.name,
            }));
            // Fetch additional data for each Pokemon and add types to the objects
            Promise.all(itemData.map((item) => {
                const url = `${baseUrl}${endpoint}${item.name}`;
                return (0, node_fetch_1.default)(url)
                    .then(response => response.json())
                    .then(data => {
                    item.id = data.id;
                    item.category = data.category.name;
                    item.sprite = data.sprites.default;
                    item.cost = data.cost;
                    return item;
                });
            })).then(data => {
                const dataString = `export const pokemonData = ${JSON.stringify(data)};`;
                // Write data to file
                const filename = 'items.ts';
                (0, fs_1.writeFileSync)(filename, dataString);
                logger_1.logger.info(`Data written to ${filename}`);
            });
        })
            .catch(error => logger_1.logger.error(error));
    });
}
exports.stealItems = stealItems;
function populate() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = tsyringe_1.container.resolve('PrismaClient');
        yield client.basePokemon.deleteMany();
        yield client.type.deleteMany();
        yield client.talent.deleteMany();
        yield client.skill.deleteMany({
            where: {
                statusTrashed: false,
            },
        });
        const pokeTypes = [
            'normal',
            'fighting',
            'flying',
            'poison',
            'ground',
            'rock',
            'bug',
            'ghost',
            'steel',
            'fire',
            'water',
            'grass',
            'electric',
            'psychic',
            'ice',
            'dragon',
            'dark',
            'fairy',
        ];
        for (let i = 0; i < pokeTypes.length; i++) {
            yield client.type.create({
                data: {
                    name: pokeTypes[i],
                },
            });
            yield client.talent.create({
                data: {
                    typeName: pokeTypes[i],
                },
            });
        }
        const skills = moves_1.skillsData;
        for (const skill of skills) {
            try {
                yield client.skill.create({
                    data: {
                        attackPower: skill.power ? skill.power : 0,
                        name: skill.name,
                        isPhysical: skill.class === 'physical',
                        isSpecial: skill.class === 'special',
                        typeName: skill.type,
                    },
                });
            }
            catch (e) {
                logger_1.logger.error(e.message);
            }
        }
        const moveLevelForMachineMoves = 50;
        const pokemons = data_1.pokemonData;
        for (let i = 0; i < pokemons.length; i++) {
            const skillTable = [];
            for (const move of pokemons[i].moves) {
                if (move.level > 0) {
                    skillTable.push(`${move.name}%${move.level}`);
                    continue;
                }
                skillTable.push(`${move.name}%${moveLevelForMachineMoves}`);
            }
            yield client.basePokemon.create({
                data: {
                    BaseAtk: pokemons[i].stats.atk,
                    BaseDef: pokemons[i].stats.def,
                    BaseHp: pokemons[i].stats.hp,
                    BaseSpAtk: pokemons[i].stats.spAtk,
                    BaseSpDef: pokemons[i].stats.spDef,
                    BaseSpeed: pokemons[i].stats.speed,
                    BaseAllStats: pokemons[i].stats.atk +
                        pokemons[i].stats.def +
                        pokemons[i].stats.hp +
                        pokemons[i].stats.spAtk +
                        pokemons[i].stats.spDef +
                        pokemons[i].stats.speed,
                    BaseExperience: pokemons[i].baseExperience,
                    defaultSpriteUrl: pokemons[i].sprites.normal,
                    shinySpriteUrl: pokemons[i].sprites.shiny,
                    type1Name: pokemons[i].types[0],
                    type2Name: pokemons[i].types[1],
                    name: pokemons[i].name,
                    height: pokemons[i].height,
                    pokedexId: pokemons[i].id,
                    skills: {
                        connect: pokemons[i].moves.map((m) => {
                            return {
                                name: m.name,
                            };
                        }),
                    },
                    skillTable: skillTable,
                    isFirstEvolution: pokemons[i].evolutionData.isFirstEvolution,
                    evolutionData: pokemons[i].evolutionData,
                },
            });
        }
        const items = items_1.itemsData;
        for (const item of items) {
            yield client.baseItem.create({
                data: {
                    name: item.name,
                    type: item.category,
                    spriteUrl: item.sprite,
                    npcPrice: item.cost,
                },
            });
        }
    });
}
exports.populate = populate;
function populateMegas() {
    return __awaiter(this, void 0, void 0, function* () {
        const moveLevelForMachineMoves = 50;
        const client = tsyringe_1.container.resolve('PrismaClient');
        const pokemons = specialPokemons_1.specialPokemons;
        for (let i = 0; i < pokemons.length; i++) {
            const skillTable = [];
            for (const move of pokemons[i].moves) {
                if (move.level > 0) {
                    skillTable.push(`${move.name}%${move.level}`);
                    continue;
                }
                skillTable.push(`${move.name}%${moveLevelForMachineMoves}`);
            }
            const isRegional = pokemons[i].name.includes(['alola', 'galar']);
            const isMega = pokemons[i].name.includes('mega');
            yield client.basePokemon.create({
                data: {
                    isRegional,
                    isMega,
                    BaseAtk: pokemons[i].stats.atk,
                    BaseDef: pokemons[i].stats.def,
                    BaseHp: pokemons[i].stats.hp,
                    BaseSpAtk: pokemons[i].stats.spAtk,
                    BaseSpDef: pokemons[i].stats.spDef,
                    BaseSpeed: pokemons[i].stats.speed,
                    BaseAllStats: pokemons[i].stats.atk +
                        pokemons[i].stats.def +
                        pokemons[i].stats.hp +
                        pokemons[i].stats.spAtk +
                        pokemons[i].stats.spDef +
                        pokemons[i].stats.speed,
                    BaseExperience: pokemons[i].baseExperience,
                    defaultSpriteUrl: pokemons[i].sprites.normal,
                    shinySpriteUrl: pokemons[i].sprites.shiny,
                    type1Name: pokemons[i].types[0],
                    type2Name: pokemons[i].types[1],
                    name: pokemons[i].name,
                    height: pokemons[i].height,
                    pokedexId: pokemons[i].id,
                    skills: {
                        connect: pokemons[i].moves.map((m) => {
                            return {
                                name: m.name,
                            };
                        }),
                    },
                    skillTable: skillTable,
                    isFirstEvolution: pokemons[i].evolutionData.isFirstEvolution,
                    evolutionData: pokemons[i].evolutionData,
                },
            });
        }
    });
}
exports.populateMegas = populateMegas;
