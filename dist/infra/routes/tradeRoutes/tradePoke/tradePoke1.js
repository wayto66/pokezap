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
exports.tradePoke1 = void 0;
const tsyringe_1 = require("tsyringe");
const AppErrors_1 = require("../../../../infra/errors/AppErrors");
const iGenTradePokemon_1 = require("../../../../server/modules/imageGen/iGenTradePokemon");
const tradePoke2_1 = require("./tradePoke2");
const tradePoke1 = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const [, , , creatorPokemonIdString, invitedPokemonIdString, confirm, sessionIdString] = data.routeParams;
    const creatorPokemonId = Number(creatorPokemonIdString);
    const invitedPokemonId = Number(invitedPokemonIdString);
    const sessionId = Number(sessionIdString);
    if (typeof creatorPokemonId !== 'number' || isNaN(creatorPokemonId))
        throw new AppErrors_1.TypeMissmatchError(creatorPokemonIdString, 'number');
    if (typeof invitedPokemonId !== 'number' || isNaN(invitedPokemonId))
        throw new AppErrors_1.TypeMissmatchError(invitedPokemonIdString, 'number');
    const prismaClient = tsyringe_1.container.resolve('PrismaClient');
    const requesterPlayer = yield prismaClient.player.findUnique({
        where: {
            phone: data.playerPhone,
        },
    });
    if (!requesterPlayer)
        throw new AppErrors_1.PlayerNotFoundError(data.playerPhone);
    if (data.fromReact && (typeof sessionId !== 'number' || isNaN(sessionId)))
        throw new AppErrors_1.TypeMissmatchError(sessionIdString, 'number');
    let session;
    if (confirm === 'CONFIRM' && data.fromReact) {
        session = yield prismaClient.session.findUnique({
            where: {
                id: sessionId,
            },
        });
        if (!session)
            throw new AppErrors_1.SessionNotFoundError(sessionId);
        if (session.invitedId !== requesterPlayer.id || session.isFinished)
            throw new AppErrors_1.SendEmptyMessageError();
    }
    const pokemons = yield prismaClient.pokemon.findMany({
        where: {
            OR: [
                {
                    id: creatorPokemonId,
                },
                {
                    id: invitedPokemonId,
                },
            ],
        },
        include: {
            baseData: true,
            owner: true,
            teamSlot1: true,
            teamSlot2: true,
            teamSlot3: true,
            teamSlot4: true,
            teamSlot5: true,
            teamSlot6: true,
        },
    });
    const creatorPokemon = pokemons.find(pokemon => pokemon.id === creatorPokemonId);
    if (!creatorPokemon)
        throw new AppErrors_1.PokemonNotFoundError(creatorPokemonId);
    const invitedPokemon = pokemons.find(poke => poke.id === invitedPokemonId);
    if (!invitedPokemon)
        throw new AppErrors_1.PokemonNotFoundError(invitedPokemonId);
    if (creatorPokemon.ownerId !== requesterPlayer.id && !data.fromReact)
        throw new AppErrors_1.PokemonDoesNotBelongsToTheUserError(creatorPokemon.id, creatorPokemon.baseData.name, requesterPlayer.name);
    if (!invitedPokemon.ownerId)
        throw new AppErrors_1.PokemonDoesNotHaveOwnerError(invitedPokemon.id, invitedPokemon.baseData.name);
    if ((_a = invitedPokemon.owner) === null || _a === void 0 ? void 0 : _a.isInRaid)
        throw new AppErrors_1.PlayerInRaidIsLockedError(invitedPokemon.owner.name);
    const invitedPlayer = yield prismaClient.player.findUnique({
        where: {
            id: invitedPokemon.ownerId,
        },
    });
    if (!invitedPlayer)
        throw new AppErrors_1.PlayerNotFoundError(String(invitedPokemon.ownerId));
    if (confirm === 'CONFIRM' && data.fromReact) {
        if (!session)
            throw new AppErrors_1.SessionIdNotFoundError(sessionId);
        return yield (0, tradePoke2_1.tradePoke2)({
            creatorPokemon,
            invitedPokemon,
            session,
        });
    }
    const newSession = yield prismaClient.session.create({
        data: {
            mode: 'poke-trade',
            creatorId: requesterPlayer.id,
            invitedId: invitedPlayer.id,
        },
    });
    const imageUrl = yield (0, iGenTradePokemon_1.iGenTradePokemon)({
        pokemon1: creatorPokemon,
        pokemon2: invitedPokemon,
    });
    const creatorPokemonDisplayName = creatorPokemon.isAdult ? creatorPokemon.baseData.name : '';
    const invitedPokemonDisplayName = invitedPokemon.isAdult ? invitedPokemon.baseData.name : '';
    return {
        message: `${requesterPlayer.name} deseja trocar seu #${creatorPokemon.id} ${creatorPokemonDisplayName} com o #${invitedPokemon.id} ${invitedPokemonDisplayName} de ${invitedPlayer.name}.
    👍 - Aceitar`,
        status: 200,
        data: null,
        imageUrl: imageUrl,
        actions: [`pz. trade poke ${creatorPokemon.id} ${invitedPokemon.id} confirm ${newSession.id}`],
    };
});
exports.tradePoke1 = tradePoke1;
//# sourceMappingURL=tradePoke1.js.map