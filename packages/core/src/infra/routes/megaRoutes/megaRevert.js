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
exports.megaRevert = void 0;
const src_1 = __importDefault(require("../../../../../prisma-provider/src"));
const getPokemonRequestData_1 = require("../../../server/helpers/getPokemonRequestData");
const generateGeneralStats_1 = require("../../../server/modules/pokemon/generateGeneralStats");
const generateHpStat_1 = require("../../../server/modules/pokemon/generateHpStat");
const AppErrors_1 = require("../../errors/AppErrors");
const megaRevert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const player = yield src_1.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemonRequestData = (0, getPokemonRequestData_1.getPokemonRequestData)({
        playerId: player.id,
        pokemonId: pokemonId,
        pokemonIdentifierString: pokemonIdString,
        searchMode,
    });
    if (!pokemonRequestData)
        throw new AppErrors_1.UnexpectedError('NO REQUEST DATA FOUND.');
    const pokemon = yield src_1.default.pokemon.findFirst({
        where: pokemonRequestData.where,
        include: {
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
            baseData: true,
        },
        orderBy: {
            level: 'desc',
        },
    });
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    if (!pokemon.baseData.name.includes('-mega'))
        throw new AppErrors_1.PokemonIsNotMegaError(pokemon.id);
    const normalForm = yield src_1.default.basePokemon.findFirst({
        where: {
            name: pokemon.baseData.name.replace('-mega', ''),
        },
    });
    if (!normalForm)
        throw new AppErrors_1.PokemonNotFoundError(pokemon.baseData.name.replace('-mega', ''));
    const shinyMultiper = pokemon.isShiny ? 1.15 : 1;
    const bossMultiplier = 1;
    yield src_1.default.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            basePokemonId: normalForm.id,
            spriteUrl: pokemon.isShiny ? normalForm.shinySpriteUrl : normalForm.defaultSpriteUrl,
            hp: Math.round((0, generateHpStat_1.generateHpStat)(normalForm.BaseHp, pokemon.level) * shinyMultiper * bossMultiplier),
            atk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(normalForm.BaseAtk, pokemon.level) * shinyMultiper * bossMultiplier),
            def: Math.round((0, generateGeneralStats_1.generateGeneralStats)(normalForm.BaseDef, pokemon.level) * shinyMultiper * bossMultiplier),
            spAtk: Math.round((0, generateGeneralStats_1.generateGeneralStats)(normalForm.BaseSpAtk, pokemon.level) * shinyMultiper * bossMultiplier),
            spDef: Math.round((0, generateGeneralStats_1.generateGeneralStats)(normalForm.BaseSpDef, pokemon.level) * shinyMultiper * bossMultiplier),
            speed: Math.round((0, generateGeneralStats_1.generateGeneralStats)(normalForm.BaseSpeed, pokemon.level) * shinyMultiper * bossMultiplier),
        },
    });
    return {
        message: '',
        react: '👌',
        status: 200,
    };
});
exports.megaRevert = megaRevert;
