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
exports.pokemonNickname = void 0;
const getPokemonRequestData_1 = require("../../../../server/helpers/getPokemonRequestData");
const AppErrors_1 = require("../../../errors/AppErrors");
const pokemonNickname = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , , pokemonIdString, nickNameUppercase, remove] = data.routeParams;
    if (!pokemonIdString)
        throw new AppErrors_1.MissingParametersPokemonInformationError();
    if (!nickNameUppercase)
        throw new AppErrors_1.MissingParameterError('Nome desejado');
    const nickname = nickNameUppercase.toLowerCase();
    const nicknameCheck = yield prisma.basePokemon.findFirst({
        where: {
            name: nickname,
        },
    });
    if (nicknameCheck)
        throw new AppErrors_1.InvalidNicknameError(nickname);
    const nicknameCheck2 = yield prisma.pokemon.findFirst({
        where: {
            nickName: nickname,
        },
    });
    if (nicknameCheck2)
        throw new AppErrors_1.NicknameAlreadyInUseError(nickname);
    let searchMode = 'string';
    const pokemonId = Number(pokemonIdString.slice(pokemonIdString.indexOf('#') + 1));
    if (!isNaN(pokemonId))
        searchMode = 'number';
    const player = yield prisma.player.findFirst({
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
    const pokemon = yield prisma.pokemon.findFirst({
        where: pokemonRequestData.where,
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
            owner: true,
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    if (!pokemon || (searchMode === 'string' && !pokemon.isAdult))
        throw new AppErrors_1.PokemonNotFoundError(pokemonRequestData.identifier);
    yield prisma.pokemon.update({
        where: {
            id: pokemon.id,
        },
        data: {
            nickName: nickname,
        },
    });
    return {
        message: ``,
        react: '👌',
        status: 200,
    };
});
exports.pokemonNickname = pokemonNickname;
