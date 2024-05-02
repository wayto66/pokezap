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
exports.pokemonBreed1 = void 0;
const src_1 = require("../../../../../image-generator/src");
const src_2 = __importDefault(require("../../../../../prisma-provider/src"));
const AppErrors_1 = require("../../../infra/errors/AppErrors");
const pokemonBreed2_1 = require("./pokemonBreed2");
const pokemonBreed1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , id1, id2, amount] = data.routeParams;
    if (!id1 || !id2)
        throw new AppErrors_1.MissingParametersBreedRouteError();
    if (amount)
        return yield (0, pokemonBreed2_1.pokemonBreed2)(data);
    const idFix1 = Number(id1.slice(id1.indexOf('#') + 1));
    if (typeof idFix1 !== 'number')
        throw new AppErrors_1.TypeMissmatchError(id1, 'number');
    const idFix2 = Number(id2.slice(id2.indexOf('#') + 1));
    if (typeof idFix2 !== 'number')
        throw new AppErrors_1.TypeMissmatchError(id2, 'number');
    const player1 = yield src_2.default.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!player1)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    const pokemon1 = yield src_2.default.pokemon.findFirst({
        where: {
            id: idFix1,
            ownerId: player1.id,
        },
        include: {
            baseData: true,
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
        },
    });
    if (!pokemon1)
        throw new AppErrors_1.PlayersPokemonNotFoundError(idFix1, player1.name);
    const pokemon2 = yield src_2.default.pokemon.findFirst({
        where: {
            id: idFix2,
            ownerId: player1.id,
        },
        include: {
            baseData: true,
            talent1: true,
            talent2: true,
            talent3: true,
            talent4: true,
            talent5: true,
            talent6: true,
            talent7: true,
            talent8: true,
            talent9: true,
        },
    });
    if (!pokemon2)
        throw new AppErrors_1.PlayersPokemonNotFoundError(idFix2, player1.name);
    const imageUrl = yield (0, src_1.iGenPokemonBreed)({
        pokemon1: pokemon1,
        pokemon2: pokemon2,
    });
    if (pokemon1.childrenId4)
        throw new AppErrors_1.PokemonAlreadyHasChildrenError(pokemon1.id, pokemon1.baseData.name, 4);
    if (pokemon2.childrenId4)
        throw new AppErrors_1.PokemonAlreadyHasChildrenError(pokemon2.id, pokemon1.baseData.name, 4);
    if (pokemon1.isShiny || pokemon2.isShiny)
        throw new AppErrors_1.CantBreedShiniesError();
    return {
        message: `*${player1.name}* inicou o processo de breed entre:
    #${pokemon1.id} ${pokemon1.baseData.name} e #${pokemon2.id} ${pokemon2.baseData.name}
    
    👍 - 1 filhote
    ❤ - 2 filhotes
    😂 - 3 filhotes
    😮 - 4 filhotes`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [
            `pz. breed ${pokemon1.id} ${pokemon2.id} 1`,
            `pz. breed ${pokemon1.id} ${pokemon2.id} 2`,
            `pz. breed ${pokemon1.id} ${pokemon2.id} 3`,
            `pz. breed ${pokemon1.id} ${pokemon2.id} 4`,
        ],
    };
});
exports.pokemonBreed1 = pokemonBreed1;
