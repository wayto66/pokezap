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
exports.battleWildPokemon = void 0;
const tsyringe_1 = require("tsyringe");
const duelNXN_1 = require("../../../server/modules/duel/duelNXN");
const handleExperienceGain_1 = require("../../../server/modules/pokemon/handleExperienceGain");
const handleRouteExperienceGain_1 = require("../../../server/modules/route/handleRouteExperienceGain");
const AppErrors_1 = require("../../errors/AppErrors");
const battleWildPokemon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [, , wildPokemonIdString, fast] = data.routeParams;
    if (!data.fromReact)
        throw new AppErrors_1.SendEmptyMessageError();
    if (!wildPokemonIdString)
        throw new AppErrors_1.MissingParametersBattleRouteError();
    const wildPokemonId = Number(wildPokemonIdString);
    if (isNaN(wildPokemonId))
        throw new AppErrors_1.TypeMissmatchError(wildPokemonIdString, 'número');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const player = yield prismaClient.player.findFirst({
        where: {
            phone: data.playerPhone,
        },
        include: {
            teamPoke1: true,
            gameRooms: true,
        },
    });
    if (!player)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (!player.teamPoke1)
        throw new AppErrors_1.PlayerDoesNotHaveThePokemonInTheTeamError(player.name);
    const playerPokemon = yield prismaClient.pokemon.findFirst({
        where: {
            id: player.teamPoke1.id,
        },
        include: {
            baseData: {
                include: {
                    skills: true,
                },
            },
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
        },
    });
    if (!playerPokemon)
        throw new AppErrors_1.PokemonNotFoundError(player.teamPoke1.id);
    const wildPokemon = yield prismaClient.pokemon.findFirst({
        where: {
            id: wildPokemonId,
        },
        include: {
            baseData: {
                include: {
                    skills: true,
                },
            },
            heldItem: {
                include: {
                    baseItem: true,
                },
            },
            ranAwayFrom: true,
            battledBy: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (!wildPokemon || !wildPokemon.gameRoomId)
        throw new AppErrors_1.PokemonNotFoundError(wildPokemonId);
    if (wildPokemon.savage === false || wildPokemon.ownerId)
        throw new AppErrors_1.PokemonAlreadyHasOwnerError(wildPokemonId, wildPokemon.baseData.name);
    if (wildPokemon.ranAwayFrom.map(player => player.id).includes(player.id))
        throw new AppErrors_1.PokemonAlreadyRanAwayError(wildPokemon.id, player.name);
    if (wildPokemon.battledBy.map(player => player.id).includes(player.id))
        throw new AppErrors_1.PokemonAlreadyBattledByPlayerError(wildPokemon.id, player.name);
    if (!player.gameRooms.map(gameRoom => gameRoom.id).includes(wildPokemon.gameRoomId))
        throw new AppErrors_1.PlayerDoesNotResideOnTheRoute(wildPokemon.gameRoomId, player.name);
    const route = yield prismaClient.gameRoom.findFirst({
        where: {
            id: wildPokemon.gameRoomId,
        },
        include: {
            players: true,
        },
    });
    if (!route)
        throw new AppErrors_1.RouteNotFoundError(player.name, `Rota: ${wildPokemon.gameRoomId}`);
    const staticImage = !!(fast && fast === 'FAST');
    yield prismaClient.pokemon.update({
        where: {
            id: wildPokemon.id,
        },
        data: {
            battledBy: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
    const duel = yield (0, duelNXN_1.duelNXN)({
        leftTeam: [playerPokemon],
        rightTeam: [wildPokemon],
        wildBattle: true,
        staticImage,
    });
    if (!duel || !duel.imageUrl)
        throw new AppErrors_1.UnexpectedError('duelo');
    if (!duel.winnerTeam)
        throw new AppErrors_1.NoDuelWinnerFoundError();
    if (!duel.loserTeam)
        throw new AppErrors_1.NoDuelLoserFoundError();
    const displayName = wildPokemon.isShiny ? `shiny ${wildPokemon.baseData.name}` : wildPokemon.baseData.name;
    const cashGain = Math.round(40 + Math.random() * 16 + (((wildPokemon.baseData.BaseExperience / 340) * wildPokemon.level) / 20) * 220);
    if (duel.loserTeam[0].id === player.teamPoke1.id) {
        yield prismaClient.pokemon.update({
            where: {
                id: wildPokemon.id,
            },
            data: {
                ranAwayFrom: {
                    connect: {
                        id: player.id,
                    },
                },
            },
        });
        yield prismaClient.player.update({
            where: {
                id: player.id,
            },
            data: {
                cash: {
                    decrement: cashGain,
                },
            },
        });
        if (fast && fast === 'FAST') {
            return {
                message: `*${player.name}* foi derrotado por ${wildPokemon.baseData.name} e perdeu ${cashGain} POKECOINS.`,
                status: 200,
                imageUrl: duel.imageUrl,
                actions: [
                    `pz. catch pokeball ${wildPokemon.id}`,
                    `pz. catch greatball ${wildPokemon.id}`,
                    `pz. catch ultraball ${wildPokemon.id}`,
                ],
            };
        }
        return {
            message: `*${player.name}* e seu *${playerPokemon.baseData.name}*
      enfrentam 
      ${displayName} level ${wildPokemon.level}.`,
            status: 200,
            actions: [`pz. catch pokeball ${wildPokemon.id}`],
            data: null,
            imageUrl: duel.imageUrl,
            afterMessage: `*${player.name}* foi derrotado por ${wildPokemon.baseData.name} e perdeu ${cashGain} POKECOINS.`,
            afterMessageActions: [`pz. catch pokeball ${wildPokemon.id}`],
            isAnimated: !staticImage,
        };
    }
    const updatedPlayer = yield prismaClient.player.update({
        where: {
            id: player.id,
        },
        data: {
            cash: {
                increment: cashGain,
            },
        },
    });
    if (!updatedPlayer)
        throw new AppErrors_1.CouldNotUpdatePlayerError('id', player.id);
    const handleWinExp = yield (0, handleExperienceGain_1.handleExperienceGain)({
        pokemon: playerPokemon,
        targetPokemon: wildPokemon,
    });
    yield (0, handleRouteExperienceGain_1.handleRouteExperienceGain)({
        route: route,
        pokemon: playerPokemon,
        targetPokemon: wildPokemon,
    });
    const winnerLevelUpMessage = handleWinExp.leveledUp
        ? `*${playerPokemon.baseData.name}* subiu para o nível ${handleWinExp.pokemon.level}!`
        : '';
    const afterMessage = `*${player.name}* vence* #${wildPokemon.id} - ${wildPokemon.baseData.name}* e recebe +${cashGain} POKECOINS.
${winnerLevelUpMessage}
👍 - Jogar poke-ball
❤ - Jogar great-ball
😂 - Jogar ultra-ball
`;
    yield prismaClient.pokemon.update({
        where: {
            id: wildPokemon.id,
        },
        data: {
            defeatedBy: {
                connect: {
                    id: player.id,
                },
            },
        },
    });
    if (fast && fast === 'FAST') {
        return {
            message: afterMessage,
            status: 200,
            imageUrl: duel.imageUrl,
            actions: [
                `pz. catch pokeball ${wildPokemon.id}`,
                `pz. catch greatball ${wildPokemon.id}`,
                `pz. catch ultraball ${wildPokemon.id}`,
            ],
            isAnimated: false,
        };
    }
    return {
        message: `*${player.name}* e *${playerPokemon.baseData.name}* VS *${displayName}*!`,
        status: 200,
        imageUrl: duel.imageUrl,
        afterMessage,
        afterMessageActions: [
            `pz. catch pokeball ${wildPokemon.id}`,
            `pz. catch greatball ${wildPokemon.id}`,
            `pz. catch ultraball ${wildPokemon.id}`,
        ],
        isAnimated: !staticImage,
    };
});
exports.battleWildPokemon = battleWildPokemon;
//# sourceMappingURL=battleWildPokemon.js.map